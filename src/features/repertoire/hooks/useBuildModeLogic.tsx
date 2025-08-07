import { useContext } from "react"
import { useChessProvider } from "@/features/chess/logic/providers/ChessProvider"
import { useRepertoireProvider } from "@/features/repertoire/providers/RepertoireProvider"
import { useModals } from "../../modals/hooks/useModals"
import { sanitizeFen } from "@/features/common/utils/utils"
import { useBoardProvider } from "@/features/chess/board/providers/BoardProvider"
import { useRepertoireLinesLogic } from "./useRepertoireLinesLogic"
import { useRepertoireStoreOperations } from "../../repertoires-list/hooks/useRepertoireStoreOperations"
import { useSunburst } from "@/features/chess/sunburst/hooks/useSunburst"
import { ChessMove } from "../../../types/ChessMove"
import { ChessPosition } from "../../../types/ChessPosition"
import { PromotionModalContext } from "@/features/chess/board/providers/PromotionModalProvider"
import {
  findLineWithMove,
  findMoveIndexInLine,
} from "@/features/chess/lines/utils/moveHandlersHelpers"

import { useAppContext } from "@/features/context/providers/AppContextProvider"
import { convertRepertoireToChessLine } from "@/features/chess/lines/utils/repertoireConverter"
import { useChessNavigation } from "@/features/chess/navigation/hooks/useChessNavigation"

export function useBuildModeLogic() {
  const { boardConfig, updateBoard } = useBoardProvider()
  const { chess, getFen } = useChessProvider()
  const { updateSunburstData } = useSunburst()
  const { repertoire, linesData, setLinesData, transpositionIndex } =
    useRepertoireProvider()
  const { openings } = useAppContext() // Accessing openings data from the AppContextProvider.

  const { updateRepertoirePosition } = useRepertoireStoreOperations()
  const { validateAndUpdatePosition } = useRepertoireLinesLogic()
  const { notifyRepertoireChange } = useRepertoireProvider() // Add this line

  const { openConflictModal } = useModals()
  const { setPromotionModalState } = useContext(PromotionModalContext)

  // Gestion d'un coup sélectionné dans le sunburst
  function handleSunburstSelection(move: ChessMove, parentMove?: ChessMove) {
    if (parentMove) {
      executeMove(parentMove)
    }
    return executeMove(move)
  }

  function executeMove(move: ChessMove) {
    chess.move(move)
    updateBoard()
  }

  /**
   * Point d'entrée unifié pour la gestion des coups
   */
  function handleBoardMove(from: string, to: string) {
    if (!from || !to) {
      return
    }

    const piece = chess.get(from)
    if ((to.endsWith("8") || to.endsWith("1")) && piece?.type === "p") {
      handlePromotionMove(from, to)
    } else {
      handleMove({ from, to })
    }
  }

  /**
   * Gère un coup de promotion de pion
   */
  function handlePromotionMove(from: string, to: string) {
    const piece = chess.get(from)
    const destinationColumn = to.charAt(to.length - 2)

    setPromotionModalState({
      isOpen: true,
      onPromotionSelect: (promotion) => {
        handleMove({ from, to, promotion })
      },
      color: piece.color,
      destinationColumn: destinationColumn,
      repertoireColor: repertoire.current.color,
    })
  }

  /**
   * Gère un coup
   */
  function handleMove(chessMove: ChessMove) {
    // Joue le coup temporairement pour obtenir le FEN suivant
    chess.move(chessMove)
    let h = chess.history({ verbose: true })
    let move = h[h.length - 1]
    move.nextFen = getFen()
    chess.undo() // On annule pour ne pas modifier la position avant le traitement définitif

    if (chess.turn() !== move.color) {
      return
    }
    const currentFen = getFen()
    let position: ChessPosition = repertoire.current.positions.get(currentFen)
    if (position) {
      if (position.moves.has(move.san)) {
        // le move existe déjà, on joue directement
        executeMove(move)
        return
      }
      if (repertoire.current.color === move.color && position.moves.size > 0) {
        // Conflit : on a déjà un coup enregistré pour le repertoire
        const [oldMove] = Array.from(position.moves.values())
        updateBoard()
        openConflictModal(
          oldMove,
          move,
          () => {
            // Ne rien faire, garder le coup original
          },
          () => {
            // Remplacer l'ancien coup par le nouveau
            position.moves.delete(oldMove.san)
            saveMoveInRepertoire(move, position)
            executeMove(move)
          },
          repertoire.current.color,
        )
        return
      }
      //No move, or already move but for opponent, in both cases, we want to save the move
    } else {
      position = new ChessPosition(currentFen)
    }
    saveMoveInRepertoire(move, position)
    executeMove(move)
  }

  /**
   * Deletes the given move from the repertoire.
   * If the position with the given FEN is in the repertoire and has the given move, deletes the move from the position.
   * Also deletes the move from the lines array and updates the repertoire position and repertoire in the object store.
   * @param fen The FEN of the position to delete the move from.
   * @param move The move to delete from the repertoire.
   */
  function deleteMoveFromRepertoire(fen: string, move: ChessMove) {
    if (repertoire.current.positions.has(fen)) {
      // If the position with the given FEN is in the repertoire
      let position = repertoire.current.positions.get(fen)

      if (position.moves.has(move.san)) {
        // If the position has the given move, delete the move from the position
        position.moves.delete(move.san)
        // Update the repertoire position and repertoire in the object store
        updateRepertoirePosition(repertoire.current, position)
        repertoire.current.positions.set(position.id, position)
      }
    }
  }

  // In useBuildModeLogic.js - Update deleteMove function

  function deleteMove(move: ChessMove) {
    const lineData = findLineWithMove(linesData, move)

    if (!lineData) return null

    const { currentLine: lineWithMoveToDelete, parentLine } = lineData
    const moveIndex = findMoveIndexInLine(lineWithMoveToDelete, move)

    if (moveIndex === -1) return null

    // Store current position before deletion
    const currentPgn = chess.pgn()

    let fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq"
    if (moveIndex === 0) {
      if (parentLine && parentLine.pgn !== "") {
        fen =
          parentLine.moveSequence[parentLine.moveSequence.length - 1].nextFen
      }
    } else {
      fen = lineWithMoveToDelete.moveSequence[moveIndex - 1].nextFen
    }

    deleteMoveFromRepertoire(fen, move)

    let { root, transpositionIndex: index } = convertRepertoireToChessLine(
      repertoire.current,
      openings,
    )
    transpositionIndex.current = index

    // ✅ NEW: Validate position and find fallback if needed
    const validatedPgn = validateAndUpdatePosition(currentPgn, root)

    // Update lines data
    setLinesData(root)

    // ✅ NEW: Load the validated position
    if (validatedPgn !== currentPgn) {
      loadPgn(validatedPgn, 0) // Load the fallback position
    }

    notifyRepertoireChange()
  }

  /**
   * Undoes the last move in the chess game.
   * Updates the sunburst data based on the current position in the chess game and the repertoire.
   */
  function undo() {
    // Undo the last move in the chess game
    chess.undo()

    // Get the last move from the chess game history
    let h = chess.history({ verbose: true })
    let lm = h[h.length - 1]

    if (lm) {
      // If there is a last move, set its nextFen to the current position in the chess game
      lm.nextFen = sanitizeFen(boardConfig.fen)
    }

    // Update the sunburst data based on the current position in the chess game and the repertoire
    // updateSunburstData(getFen(), lm)

    // Set the configuration based on the current position in the chess game
    updateBoard()
  }

  function saveMoveInRepertoire(move: ChessMove, position: ChessPosition) {
    if (chess.turn() !== move.color) {
      // If the move is not of the same color as the current turn, do nothing
      return
    }
    const moveToSave: ChessMove = {
      from: move.from,
      to: move.to,
      piece: move.piece,
      san: move.san,
      nextFen: move.nextFen,
      color: move.color,
      flags: move.flags,
      captured: move.captured ? move.captured : undefined,
    }

    // Mise à jour de la logique réactive
    position.moves.set(move.san, moveToSave)
    updateRepertoirePosition(repertoire.current, position)
    repertoire.current.positions.set(getFen(), position)
    // updateLinesWithNewMove(moveToSave)
    let { root, transpositionIndex: index } = convertRepertoireToChessLine(
      repertoire.current,
      openings,
    )
    transpositionIndex.current = index
    setLinesData(root)

    notifyRepertoireChange()
  }

  /**
   * Loads the given PGN into the chess game.
   * If the history length is greater than the given number of moves to undo, undoes the given number of moves.
   * Updates the configuration based on the current position in the chess game.
   * @param pgn The PGN to load into the chess game.
   * @param toUndo The number of moves to undo.
   */
  function loadPgn(pgn: string, toUndo: number) {
    // Load the PGN into the chess game
    chess.load_pgn(pgn)

    // Get the history of the chess game
    let history = chess.history()

    if (history.length > toUndo) {
      // If the history length is greater than the given number of moves to undo, undo the given number of moves
      for (let index = 0; index < toUndo; index++) {
        chess.undo()
      }
    }

    // Update the configuration based on the current position in the chess game
    updateBoard()
  }

  return {
    handleBoardMove,
    undo,
    loadPgn,
    handleSunburstSelection,
    deleteMoveFromRepertoire,
    deleteMove,
    updateSunburstData,
    // Ajoutez ici d’autres callbacks ou états extraits
  }
}
