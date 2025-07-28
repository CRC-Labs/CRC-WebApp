import { useCallback } from "react"
import { useChessProvider } from "@/features/chess/logic/providers/ChessProvider"
import { getNextMove } from "@/features/chess/logic/utils/moveUtils"
import { useBoardProvider } from "@/features/chess/board/providers/BoardProvider"
import { useRepertoireProvider } from "@/features/repertoire/providers/RepertoireProvider"
import { getLinePgnUpToIndex } from "../../logic/utils/pgnUtils"

export function useChessNavigation(repertoire: any) {
  const { chess, getFen } = useChessProvider()
  const { updateBoard } = useBoardProvider()
  const { transpositionIndex } = useRepertoireProvider()

  const navigateToPreviousMove = useCallback(() => {
    chess.undo()
    setTimeout(() => {
      updateBoard()
    }, 0)
  }, [chess])

  const navigateToNextMove = useCallback(() => {
    let transpositionElement = transpositionIndex.current.get(getFen())
    if (
      transpositionElement &&
      transpositionElement.usedIn &&
      transpositionElement.usedIn.length > 0
    ) {
      if (!transpositionElement.line.pgn.startsWith(chess.pgn())) {
        if (
          transpositionElement.line.moveSequence.length >
          transpositionElement.moveIndex + 1
        )
          chess.load_pgn(
            getLinePgnUpToIndex(
              transpositionElement.line,
              transpositionElement.moveIndex,
            ),
          )
      }
    }
    const nextMove = getNextMove(repertoire, chess)
    if (nextMove !== null) {
      chess.move(nextMove)
      setTimeout(() => {
        updateBoard()
      }, 0)
    }
  }, [chess, repertoire])

  const navigateToStart = useCallback(() => {
    chess.reset()
    setTimeout(() => {
      updateBoard()
    }, 0)
  }, [chess])

  return {
    navigateToPreviousMove,
    navigateToNextMove,
    navigateToStart,
  }
}
