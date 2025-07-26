import Board from "@/features/chess/board/components/Board"

import { useChessProvider } from "@/features/chess/logic/providers/ChessProvider"
import MultiRangeSlider from "@/features/common/components/MultiRangeSlider"
import { Icon } from "@/features/common/utils/icons"
import { whoIsToPlayComponent } from "@/features/common/utils/utils"
import { useSettingsProvider } from "@/features/settings/providers/SettingsProvider"
import { ChessLine } from "../../../types/ChessLine"
import { ChessMove } from "../../../types/ChessMove"
import { RepertoireMode } from "../../../types/Repertoire"
import { Config } from "chessground/config"
import React, { useContext, useEffect, useRef, useState } from "react"
import RepertoireSideLayout from "./RepertoireSideLayout"
import { useRepertoireLinesLogic } from "../hooks/useRepertoireLinesLogic"
import { useRepertoireProvider } from "../providers/RepertoireProvider"
import { PromotionModalContext } from "@/features/chess/board/providers/PromotionModalProvider"
import { useBoardProvider } from "@/features/chess/board/providers/BoardProvider"

function RepertoireTrainer({ width, height }) {
  // Import necessary hooks and components
  const {
    smartMove,
    clickBoardReset,
    resetMinRangeWhenUnlock,
    resetBoardWhenMinTrainingRangeChanged,
  } = useSettingsProvider()
  const { repertoire, mode, quickTrainPosition, setQuickTrainPosition } =
    useRepertoireProvider()
  const { linesData } = useRepertoireLinesLogic()
  // Get the chess instance and boardConfiguration from the chess provider
  const {
    chess,
    getConfigFromChess,
    getFen,
    getOpeningName,
    getTurnNumberFromChessHistory,
  } = useChessProvider()

  const stats = useRef(new Map<String, any>())
  const depthIndex = useRef(new Map<number, Array<String>>())
  const { setPromotionModalState } = useContext(PromotionModalContext)

  // Define a function to index the children of a ChessLine
  function indexChildren(depth, children) {
    children.forEach((child) => {
      // Recursively index the children of each ChessLine
      indexChessLine(depth + 1, child)
    })
  }
  const { boardConfig, setBoardConfig } = useBoardProvider()

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

  // If the depthIndex map is empty, index the children of each ChessLine in the linesData object
  if (depthIndex.current.size === 0) {
    let depth = 1
    linesData.children.forEach((child) => {
      // Index the children of each ChessLine
      indexChildren(depth, child.children)
    })
  }

  function indexChessLine(depth, chessLine: ChessLine) {
    /**Process PGN for depth */

    // Calculate the number of characters to add to the depth for the PGN index
    let toAdd = depth.toString().length + 2

    // Find the end index of the PGN for the current depth
    let iEnd = chessLine.pgn.indexOf(depth + ". ")
    if (iEnd === -1) {
      // If the end index is not found, return
      return
    }
    iEnd += toAdd

    // Extract the PGN for the current depth
    let toPush
    if (repertoire.current.color === "b") {
      // If the current color is black, find the index of the first move and extract the PGN up to that point
      let firstMoveIndex = chessLine.pgn.indexOf(" ", iEnd)
      toPush = chessLine.pgn.substring(0, firstMoveIndex)
    } else {
      // If the current color is white, extract the PGN up to the end index minus the characters added for the depth index
      toPush = chessLine.pgn.substring(0, iEnd - toAdd - 1)
    }

    // Calculate the depth of the current line
    let lineDepth = Math.floor(chessLine.depth / 2) + 1

    // Check if the current line is unfinished and at the desired depth
    if (chessLine.unfinished && lineDepth === depth) {
      // If the line is unfinished and at the desired depth, return
      return
    }

    // Add the PGN for the current depth to the depth index
    if (!depthIndex.current.has(depth)) {
      depthIndex.current.set(depth, new Array())
    }
    depthIndex.current.get(depth).push(toPush)

    /**Check if same line contains more depth */
    if (lineDepth > depth) {
      // If the current line contains more depth, recursively index the next depth
      indexChessLine(depth + 1, chessLine)
    } else {
      /**Iterate over children if children */
      // If the current line does not contain more depth, recursively index the children
      indexChildren(lineDepth, chessLine.children)
    }
  }
  // Define state variables for the trainer's playability, number of turns, smart move initialization, trainer state, information message, maximum training depth, minimum training depth, and configuration
  let playable = true
  const nbTurn = useRef(1)
  const [smInit, setSmInit] = useState(false)
  const [trainerState, setTrainerState] = useState("playing")
  const [infoMessage, setInfoMessage] = useState(undefined)
  const [minTrainingDepth, _setMinTrainingDepth] = useState(1)
  const [maxTrainingDepth, _setMaxTrainingDepth] = useState(
    localStorage.maxTrainingDepth ? localStorage.maxTrainingDepth : 40,
  )

  if (!localStorage.maxTrainingDepth) {
    localStorage.maxTrainingDepth = maxTrainingDepth
  }

  // const [config, setBoardConfig] = useState<Partial<Config> | null>(
  //   refreshConfWithSmartMove(getConfigFromChess()),
  // )

  function setMinTrainingDepth(val: number) {
    _setMinTrainingDepth(val)
  }

  useEffect(() => {
    if (mode !== RepertoireMode.TRAIN) {
      return
    }
    if (minTrainingDepth > getTurnNumberFromChessHistory()) {
      computeTrainerState()
    } else if (quickTrainPosition.turn > minTrainingDepth) {
      _setMinTrainingDepth(quickTrainPosition.turn)
      computeTrainerState(false)
    } else if (
      minTrainingDepth < getTurnNumberFromChessHistory() &&
      resetBoardWhenMinTrainingRangeChanged
    ) {
      computeTrainerState()
    }
    if (maxTrainingDepth <= minTrainingDepth) {
      setMaxTrainingDepth(minTrainingDepth + 1)
    }
    if (maxTrainingDepth <= getTurnNumberFromChessHistory()) {
      computeTrainerState()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minTrainingDepth, maxTrainingDepth, quickTrainPosition.turn])

  function setMaxTrainingDepth(val) {
    localStorage.maxTrainingDepth = val
    _setMaxTrainingDepth(val)
  }

  // Define a variable to hold the CSS class to add to the training panel based on the trainer state
  let classtoAdd = ""
  if (trainerState === "success") {
    // If the trainer state is "success", add a green background color to the training panel
    classtoAdd = "bg-emerald-600/40 dark:bg-emerald-300/60 "
  } else if (trainerState === "error") {
    // If the trainer state is "error", add an orange background color to the training panel
    classtoAdd = "bg-orange-600/40 dark:bg-orange-300/60 "
  }

  // Define a function to set the configuration for the trainer and refresh it with the smart move
  function setConfig(conf: Partial<Config>) {
    // Use the `refreshConfWithSmartMove` function to refresh the configuration with the smart move
    setBoardConfig(refreshConfWithSmartMove(conf))
  }

  function smartMoveFunc(key) {
    // Get the current FEN and position from the repertoire
    let fen = getFen()
    let pos = repertoire.current.positions.get(fen)

    // If the position is not found or the trainer is not playable, return
    if (!pos || !playable) {
      return
    }

    // Get the first move from the position's moves
    let goodmove: ChessMove = pos.moves.values().next().value

    // If smart move is enabled and the mode is training
    if (smartMove === true && mode === RepertoireMode.TRAIN) {
      // Set the trainer to not playable
      playable = false

      // If the good move is the same as the key pressed, make the move
      if (goodmove.to === key) {
        handleBoardMove(goodmove.from, goodmove.to)
      } else {
        // If the good move is not the same as the key pressed, update the stats, show the good move on the board, and set the trainer state to error
        updateStatsAfterBadMove(fen)
        showGoodMoveOnBoard(goodmove)
        nbTurn.current++
        setTrainerState("error")
      }

      // Set the trainer to playable after a delay
      setTimeout(() => {
        playable = true
      }, 300)
    }
  }

  // Use an effect hook to set the configuration for the trainer when the smart move state variable changes
  useEffect(() => {
    if (mode === RepertoireMode.TRAIN) {
      setConfig(boardConfig)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smartMove])

  // Use an effect hook to handle the trainer's moves and update the trainer state
  useEffect(() => {
    // document.addEventListener("touchstart", handleClick)
    if (mode !== RepertoireMode.TRAIN) {
      return
    }

    // Get the history of moves from the chess object
    let h = chess.history({ verbose: true })

    // If the history is not empty, check if the last move was made by the trainer or the user
    if (h.length > 0) {
      if (chess.turn() !== repertoire.current.color) {
        // If the last move was made by the user, undo the move and make the move again using the `afterMove` function
        chess.undo()
        handleBoardMove(h[h.length - 1].from, h[h.length - 1].to)
      } else {
        // If the last move was made by the trainer, set the trainer state to success if there are no more moves to play or return the moves to play
        setSuccessIfNoMoreMovesToPlayOrReturnMoves()
      }
    }

    // Reset the board
    computeTrainerState()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Check if the current color in the repertoire is black and the configuration orientation is white or not defined
  if (
    repertoire.current.color === "b" &&
    (boardConfig.orientation === "white" || !boardConfig.orientation)
  ) {
    // Create a new configuration object with the viewOnly and drawable properties set to false and the orientation property set to black
    let conf = getConfigFromChess(
      false,
      boardConfig.viewOnly,
      boardConfig.drawable,
    )
    conf.orientation = "black"

    // If smart move is not initialized, set the configuration using the `setConfig` function and set the smart move initialization state variable to true
    if (!smInit) {
      setConfig(conf)
      setSmInit(true)
    } else {
      // If smart move is initialized, set the configuration using the `setBoardConfig` function
      setBoardConfig(conf)
    }
  } else if (
    // Check if the current color in the repertoire is white and the configuration orientation is black
    repertoire.current.color === "w" &&
    boardConfig.orientation === "black"
  ) {
    // Create a new configuration object with the viewOnly and drawable properties set to false and the orientation property set to white
    let conf = getConfigFromChess(
      false,
      boardConfig.viewOnly,
      boardConfig.drawable,
    )
    conf.orientation = "white"

    // If smart move is not initialized, set the configuration using the `setConfig` function and set the smart move initialization state variable to true
    if (!smInit) {
      setConfig(conf)
      setSmInit(true)
    } else {
      // If smart move is initialized, set the configuration using the `setBoardConfig` function
      setBoardConfig(conf)
    }
  }

  // Check the trainer state and update the configuration accordingly
  if (trainerState === "success" && boardConfig.viewOnly === false) {
    // If the trainer state is "success" and viewOnly is false, set the configuration to viewOnly and drawable to true
    setBoardConfig(getConfigFromChess(true, true))
  } else if (trainerState === "playing" && boardConfig.viewOnly) {
    // If the trainer state is "playing" and viewOnly is true, set the configuration to viewOnly to false and drawable to false
    setBoardConfig(getConfigFromChess(true, false))
  } else if (trainerState === "error" && boardConfig.viewOnly === false) {
    // If the trainer state is "error" and viewOnly is false, set the configuration to viewOnly to false and drawable to true
    setBoardConfig(getConfigFromChess(false, true, boardConfig.drawable))
  }

  function refreshConfWithSmartMove(conf) {
    // Create a copy of the configuration object
    let tmpConf = { ...conf }

    // Set the events property of the configuration object to an object with a select property that points to the `smartMoveFunc` function
    tmpConf.events = {
      select: smartMoveFunc,
    }

    // If smart move is enabled, disable draggable and selectable properties of the configuration object
    if (smartMove) {
      tmpConf.draggable.enabled = false
      tmpConf.selectable = { enabled: false }
    } else {
      // If smart move is not enabled, enable draggable and selectable properties of the configuration object
      tmpConf.draggable.enabled = true
      tmpConf.selectable = { enabled: true }
    }

    // Return the updated configuration object
    return tmpConf
  }

  function computeTrainerState(refreshBoard = true) {
    // Reset the chess board
    //chess.reset()
    if (refreshBoard) chess.load_pgn(quickTrainPosition.pgn)

    // If the mode is training
    if (mode === RepertoireMode.TRAIN) {
      // Set the info message to an empty string
      setInfoMessage("")

      // If the repertoire doesn't contain any positions, set the info message and trainer state to "error" and return
      if (repertoire.current.positions.size === 0) {
        setInfoMessage(
          "Your repertoire doesn't contain any position, let's first go into build mode and add some moves in your repertoire.",
        )
        setTrainerState("error")
        return
      }

      // If the repertoire doesn't contain the position or any playable move for the saved position, set the info message and trainer state to "error" and return
      if (!repertoire.current.positions.has(getFen())) {
        setInfoMessage(
          "Impossible to train from the selected position (end of line). Please select a correct training position",
        )
        setTrainerState("error")
        return
      }

      // Get the list of moves for the current position from the repertoire
      let moves = [...repertoire.current.positions.get(getFen()).moves.values()]

      // If there are no moves for the current position, set the trainer state to "success" and return false
      if (moves.length === 0) {
        setInfoMessage(
          "The selected training position is incorrect (end of line).",
        )
        setTrainerState("error")
        return
      }

      // If the minimum training depth is greater than turn, get the candidates for the minimum training depth and choose a random candidate to load
      if (minTrainingDepth > quickTrainPosition.turn) {
        /** TODO : check probabilities between candidates */
        let candidates = depthIndex.current.get(minTrainingDepth)
        if (candidates === undefined) {
          // If the repertoire doesn't contain any positions for the chosen training min depth range, set the info message and trainer state to "error" and return
          setInfoMessage(
            "Your repertoire doesn't contain any position for the choosen turn (" +
              minTrainingDepth +
              "). Please lower the minimum training range.",
          )
          setTrainerState("error")
          return
        }
        /** TODO : filter candidates to match quickTrainPosition */
        candidates = candidates.filter((str) =>
          str.startsWith(quickTrainPosition.pgn),
        )
        if (candidates.length === 0) {
          // If the repertoire doesn't contain any positions for the chosen turn, set the info message and trainer state to "error" and return
          setInfoMessage(
            "Your repertoire doesn't contain any position for the choosen turn (" +
              minTrainingDepth +
              "). Please lower the minimum training range.",
          )
          setTrainerState("error")
          return
        }
        let t = between(0, candidates.length - 1)
        chess.load_pgn(candidates.at(t))
      }

      // Set the trainer state to "playing"
      setTrainerState("playing")

      // If it's the trainer's turn, play a candidate move from the repertoire
      if (chess.turn() !== repertoire.current.color) {
        let h = chess.history({ verbose: true })
        playCandidateMoveFromRepertoire(h)
      }

      // Set the configuration to viewOnly and drawable
      setConfig(getConfigFromChess(true))
    }
  }

  function handleMove(move) {
    // Get the current FEN of the chess board
    let fen = getFen()

    // Make the move on the chess board
    chess.move(move)

    // Check if the last move was made by the player or the trainer
    if (chess.turn() !== repertoire.current.color) {
      //last move was made by the player
      // Get the history of moves from the chess object
      let h = chess.history({ verbose: true })

      // Get the position from the repertoire for the current FEN
      let pos = repertoire.current.positions.get(fen)
      // If the position is not in the repertoire, set the trainer state to "error" and return
      if (!pos) {
        setTrainerState("error")
        setConfig(getConfigFromChess(true, true))
        nbTurn.current++
        return
      }

      // Get the good move for the position from the repertoire
      let goodmove: ChessMove = pos.moves.values().next().value

      // If the last move was not the good move, update the stats for the position, undo the move, show the good move on the board, set the trainer state to "error", and return
      if (h[h.length - 1].san !== goodmove.san) {
        updateStatsAfterBadMove(fen)
        chess.undo()
        showGoodMoveOnBoard(goodmove)
        nbTurn.current++
        setTrainerState("error")
        return
      } else {
        // If the last move was the good move, handle the after-move functionality
        afterGoodMove(fen, h)
      }
    }
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

  function showGoodMoveOnBoard(goodmove: ChessMove) {
    // If the good move is a promotion, make the move with the promotion piece
    if (goodmove.san.includes("=")) {
      let i = goodmove.san.indexOf("=") + 1
      let c = goodmove.san.charAt(i).toLowerCase()
      chess.move({ from: goodmove.from, to: goodmove.to, promotion: c })
    }

    // Create a configuration object with the good move selected and drawable
    let conf = getConfigFromChess(false, true)
    conf.selected = null
    conf.drawable = {
      autoShapes: [
        {
          orig: goodmove.from,
          dest: goodmove.to,
          brush: "green",
        },
      ],
    }

    // Set the configuration object to the state
    setConfig(conf)
  }

  function updateStatsAfterBadMove(fen: any) {
    // Get the stats for the position from the stats map
    let spos = stats.current.get(fen)

    // If the position is not in the stats map, create a new stats object and add it to the map
    if (!spos) {
      spos = {
        tries: 1,
        success: 0,
        streak: -1,
        lastSeen: nbTurn.current,
      }
      stats.current.set(fen, spos)
    } else {
      // If the position is in the stats map, update the stats object
      spos.tries++
      spos.streak = spos.streak > 0 ? -1 : spos.streak - 1
      spos.lastSeen = nbTurn.current
    }

    // Update the coefficients for the position
    updatingCoefs(spos)
  }

  function afterGoodMove(fen: any, h: any) {
    // Get the stats for the position from the stats map
    let spos = stats.current.get(fen)

    // If the position is not in the stats map, create a new stats object and add it to the map
    if (!spos) {
      spos = {
        tries: 1,
        success: 1,
        streak: 1,
        lastSeen: nbTurn.current,
      }
      stats.current.set(fen, spos)
    } else {
      // If the position is in the stats map, update the stats object
      spos.tries++
      spos.success++
      spos.streak = spos.streak > 0 ? spos.streak + 1 : 1
      spos.lastSeen = nbTurn.current
    }
    stats.current.set("lastpos", fen)

    // Update the coefficients for the position
    updatingCoefs(spos)

    // Play the candidate move from the repertoire
    playCandidateMoveFromRepertoire(h)

    // Set the configuration object to viewOnly and drawable
    setConfig(
      getConfigFromChess(true, boardConfig.viewOnly, boardConfig.drawable),
    )
  }

  function updatingCoefs(spos) {
    // Calculate the streak coefficient by squaring the streak value
    spos.streakCoeff = spos.streak * spos.streak

    // Calculate the success ratio by dividing the number of successful attempts by the total number of attempts
    let successRatio = spos.success / spos.tries

    // If the success ratio is 0, set it to 0.01 to avoid division by zero errors
    if (successRatio === 0) {
      successRatio = 0.01
    }

    // Calculate the ratio coefficient by taking the reciprocal of the square of the success ratio, and dividing by 4
    spos.ratioCoef = 1 / (successRatio * successRatio) / 4
  }

  function isCheckBadgeEarned(previous = false) {
    // Get the FEN notation for the current position
    let fen = getFen()

    // If the `previous` flag is set, undo the last move and get the FEN notation for the previous position
    if (previous) {
      fen = stats.current.get("lastpos")
    }

    // Get the stats for the position from the stats map
    let spos = stats.current.get(fen)

    // If the position is in the stats map and the streak is greater than or equal to 5, return true
    if (spos && spos.streak >= 5) {
      return true
    }

    // If the position is not in the stats map or the streak is less than 5, return false
    return false
  }

  function isLearningAdviceRequired() {
    // Get the stats for the current position from the stats map
    let spos = stats.current.get(getFen())

    // If the position is in the stats map and the streak is less than or equal to -2, return true
    if (spos && spos.streak <= -2) {
      return true
    }

    // If the position is not in the stats map or the streak is greater than -2, return false
    return false
  }

  function calculateMoveNumberFromCurrentPosition(fen) {
    // Get the move number from the FEN notation of the current position
    let m = fen.split(" ")[5]
    let mNumber = parseInt(m, 10)

    // If the current color is white, increment the move number
    if (repertoire.current.color === "w") {
      mNumber++
    }
    return mNumber
  }

  function setSuccessIfNoMoreMovesToPlayOrReturnMoves() {
    let mNumber = calculateMoveNumberFromCurrentPosition(getFen())

    // If the move number is greater than or equal to the maximum training depth, set the trainer state to "success" and return false
    if (mNumber >= localStorage.maxTrainingDepth) {
      nbTurn.current++
      setTrainerState("success")
      setConfig(getConfigFromChess(true, true)) //Force redisplay board
      return false
    }

    // If the current position is not in the repertoire, set the trainer state to "success" and return false
    if (!repertoire.current.positions.has(getFen())) {
      nbTurn.current++
      setTrainerState("success")
      setConfig(getConfigFromChess(true, true)) //Force redisplay board
      return false
    }

    // Get the list of moves for the current position from the repertoire
    let moves = [...repertoire.current.positions.get(getFen()).moves.values()]

    // If there are no moves for the current position, set the trainer state to "success" and return false
    if (moves.length === 0) {
      setTrainerState("success")
      nbTurn.current++
      setConfig(getConfigFromChess(true, true)) //Force redisplay board
      return false
    }

    // If there are moves for the current position, return the list of moves
    return moves
  }

  function getProbabilityOfApparition(fen) {
    let factor = 1

    // Get the stats for the position from the stats map
    let spos = stats.current.get(fen)
    // If the position is in the stats map, calculate the factor based on the stats
    if (spos) {
      // Calculate the turn since the position was last seen
      let turnSinceSeen = nbTurn.current - spos.lastSeen

      // Calculate the no-seen coefficient using the turn since seen
      let noSeenCoeff = Math.exp(turnSinceSeen / 30) - 1

      // If the no-seen coefficient is greater than 1.5, set it to 1.5
      if (noSeenCoeff > 1.5) {
        noSeenCoeff = 1.5
      }

      // If the position is in a winning streak, calculate the factor based on the streak and no-seen coefficient
      if (spos.streak > 0) {
        factor = factor - spos.streakCoeff + noSeenCoeff

        // If the factor is less than or equal to 0, set it to 0.1
        if (factor <= 0) {
          factor = 0.1
        }
      }
      // If the position is in a losing streak, calculate the factor based on the streak and no-seen coefficient
      else {
        factor += spos.streakCoeff + 10 * noSeenCoeff
      }
    }
    // If the position is not in the stats map, return a default probability of 150
    else {
      return 150
    }

    let pchild

    // Get the current computed depth of the position
    let currentComputedDepth = fen.slice(-1)

    // If the current computed depth is less than the maximum training depth, calculate the probability of the child position
    if (currentComputedDepth < maxTrainingDepth) {
      let pos = repertoire.current.positions.get(fen)

      // If the position is in the repertoire and has only one move, get the next position and calculate the probability of its children
      if (pos && pos.moves.size === 1) {
        const [goodMoveForCurrentCandidatePos] = pos.moves.values()
        let nextPosFen = goodMoveForCurrentCandidatePos.nextFen
        let nextPos = repertoire.current.positions.get(nextPosFen)

        // If the next position is in the repertoire, calculate the probability of its children
        if (nextPos) {
          let nextCandidateMoves = nextPos.moves

          // If the next position has more than one move, calculate the average probability of its children
          if (nextCandidateMoves.size > 1) {
            let childTotal = 0
            for (let m of nextCandidateMoves.values()) {
              childTotal += getProbabilityOfApparition(m.nextFen)
            }
            pchild = childTotal / nextCandidateMoves.size
          }
        }
      }
    }

    // Calculate the probability based on the factor, ratio coefficient, and child probability (if any)
    let p = 100 * factor * spos.ratioCoef
    if (pchild) {
      p = (p + pchild) / 2
    }

    // If the probability is less than 0, set it to 5
    if (p < 0) {
      p = 5
    }
    if (spos.unfinished >= 1) {
      p = p - 10 * spos.unfinished
    }
    if (p < 0) {
      p = 2.5
    }

    // Return the probability
    return p
  }

  function pickAMoveFromMoves(moves: ChessMove[]): ChessMove {
    let choosenMove
    let moveElements = []
    let totalScore = 0

    // Calculate the probability of each move and add it to the moveElements array
    for (let m of moves) {
      let moveElement = {
        move: m,
        p: getProbabilityOfApparition(m.nextFen),
      }
      ;(totalScore += moveElement.p), moveElements.push(moveElement)
    }

    // Sort the moveElements array in descending order of probability
    moveElements.sort((a, b) => {
      if (a.p > b.p) {
        return -1
      } else if (a.p < b.p) {
        return 1
      }
      return 0
    })

    let trigger = 0
    let pick = between(1, totalScore)

    // Iterate through the moveElements array and select a move based on its probability
    for (const m of moveElements) {
      trigger += m.p

      if (pick <= trigger) {
        //Selected
        return m.move
      }
    }

    // If no move has been selected, select the last move in the moveElements array
    if (!choosenMove) {
      choosenMove = moveElements.pop().move
    }

    // Return the selected move
    return choosenMove
  }

  function between(min, max) {
    // Generate a random integer between `min` and `max` (inclusive)
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function playCandidateMoveFromRepertoire(h) {
    // Get the list of moves for the current position from the repertoire
    let moves = setSuccessIfNoMoreMovesToPlayOrReturnMoves()
    // If there are no more moves to play, return
    if (moves === false) {
      return
    }

    let choosenMove

    // If there is only one move, select it
    if (moves.length === 1) {
      choosenMove = moves[0]
    }
    // If there are multiple moves, select a move based on its probability of appearing in the training
    else {
      choosenMove = pickAMoveFromMoves(moves)
    }

    // If the selected move includes a promotion, set the promotion piece
    if (choosenMove.san.includes("=")) {
      let i = choosenMove.san.indexOf("=")
      let c = choosenMove.san.charAt(i + 1)
      choosenMove.promotion = c.toLowerCase()
    }

    // Make the selected move on the chess board
    chess.move(choosenMove)

    // Get the history of the moves made on the chess board
    h = chess.history({ verbose: true })

    // If the current position is not in the repertoire, set the trainer state to "success"
    if (!repertoire.current.positions.has(getFen())) {
      setTrainerState("success")
      setInfoMessage(
        "Your repertoire doesn't have a response after opponent's last move, you should certainly add an appropriate move to play in this position !",
      )
      //lower probability of apparition of the move for the future
      let spos = stats.current.get(getFen())

      // If the position is not in the stats map, create a new stats object and add it to the map
      if (!spos) {
        spos = {
          tries: 1,
          success: 1,
          streak: 1,
          lastSeen: nbTurn.current,
          unfinished: 1,
        }
        stats.current.set(getFen(), spos)
      } else {
        // If the position is in the stats map, update the stats object
        spos.tries++
        spos.success++
        spos.streak = spos.streak > 0 ? spos.streak + 1 : 1
        spos.lastSeen = nbTurn.current
        spos.unfinished++
      }
      // Update the coefficients for the position
      updatingCoefs(spos)
    }
  }

  return (
    <>
      <div
        className="relative"
        style={{
          height: height,
          width: width,
        }}
        onMouseDown={(e) => {
          if (clickBoardReset && trainerState !== "playing") {
            e.stopPropagation()
            e.preventDefault()
            computeTrainerState()
          }
        }}
      >
        <Board config={boardConfig} afterMoveFunc={handleBoardMove} />
      </div>

      <RepertoireSideLayout pgn={chess.pgn()}>
        <div className="relative flex h-full w-full flex-col">
          <div
            className="absolute flex w-full flex-col items-center justify-center p-2 px-5"
            style={{
              fontSize: height / 60,
              marginTop: height / 60 + 8,
              left: width / 70,
            }}
          >
            <label className="flex items-center">
              <p
                style={{
                  fontSize: height / 60 + 5,
                  marginBottom: height / 160 + 5,
                }}
                className="text-gray-500 dark:text-gray-400"
              >
                Training Range
              </p>{" "}
            </label>
            <div className="relative w-full text-black dark:text-white">
              <MultiRangeSlider
                min={1}
                max={40}
                minVal={minTrainingDepth}
                maxVal={maxTrainingDepth}
                setMinVal={setMinTrainingDepth}
                setMaxVal={setMaxTrainingDepth}
                minTurn={quickTrainPosition.turn}
                locked={quickTrainPosition.name !== "Starting position"}
                width={width}
              />
            </div>
          </div>

          <div
            className={classtoAdd + "flex h-full flex-col"}
            style={{
              marginTop: height / 12 + 35,
            }}
          >
            <div className="flex items-center justify-between bg-gray-400/20 p-2 shadow-inner dark:bg-gray-300/80">
              <div className="flex items-center">
                <button
                  className={
                    (trainerState === "success" || trainerState === "error"
                      ? "animate-pulse "
                      : chess.pgn() === quickTrainPosition.pgn
                        ? "opacity-30 cursor-default "
                        : "focus:ring-2 hover:bg-zinc-400 dark:hover:bg-zinc-600 ") +
                    "rounded-lg p-2  text-gray-600 dark:text-gray-100 border-gray-400 bg-zinc-300 shadow-md  dark:border-gray-500 dark:bg-zinc-700 focus:outline-none"
                  }
                  onClick={() => {
                    computeTrainerState()
                  }}
                >
                  <Icon
                    name="Reset"
                    fill="currentColor"
                    style={{
                      width: width / 16,
                      height: height / 16,
                    }}
                  />
                </button>
              </div>

              <div className="ml-2 flex items-center justify-center font-bold">
                <div
                  style={{
                    fontSize: height / 60 + 5,
                  }}
                  className="flex flex-col px-2 text-gray-600"
                >
                  <div className="text-gray-500">Training from</div>
                  <div>
                    {quickTrainPosition.name} (Turn: {quickTrainPosition.turn})
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  className={
                    (trainerState === "success" || trainerState === "error"
                      ? " "
                      : chess.history().length === 0
                        ? "opacity-30 cursor-default "
                        : "focus:ring-2 hover:bg-zinc-400 dark:hover:bg-zinc-600 ") +
                    "rounded-lg p-2 text-gray-600 dark:text-gray-100 border-gray-400 bg-zinc-300 shadow-md  dark:border-gray-500 dark:bg-zinc-700 focus:outline-none"
                  }
                  onClick={() => {
                    if (chess.history().length === 0) return
                    if (quickTrainPosition.name !== "Starting position") {
                      setQuickTrainPosition({
                        pgn: "",
                        name: "Starting position",
                        turn: 1,
                      })
                      if (resetMinRangeWhenUnlock) {
                        setMinTrainingDepth(1)
                      }
                    } else {
                      setQuickTrainPosition({
                        pgn: chess.pgn(),
                        name: getOpeningName(),
                        turn: getTurnNumberFromChessHistory(),
                      })
                    }
                  }}
                >
                  {quickTrainPosition.name !== "Starting position" ? (
                    <Icon
                      name="LockClosed"
                      style={{
                        width: width / 16,
                        height: height / 16,
                      }}
                    />
                  ) : (
                    <Icon
                      name="LockOpen"
                      style={{
                        width: width / 16,
                        height: height / 16,
                      }}
                    />
                  )}
                </button>
              </div>
            </div>

            {trainerState === "playing" && (
              <div className="flex justify-between gap-2 p-4">
                {whoIsToPlayComponent(chess.turn())}
                <div
                  style={{
                    width: width / 12,
                    height: height / 12,
                  }}
                >
                  {isCheckBadgeEarned() && (
                    <Icon
                      name="CheckBadge"
                      style={{
                        width: width / 12,
                        height: height / 12,
                      }}
                    />
                  )}
                </div>
              </div>
            )}
            {trainerState === "error" && (
              <div className="relative flex flex-col items-center justify-center gap-2 bg-zinc-300/80 p-2 text-center text-gray-600 shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-400">
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-600 via-indigo-500 to-emerald-300"></span>
                <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-600 via-indigo-500 to-emerald-300"></span>

                {isLearningAdviceRequired() ? (
                  <>
                    <h5
                      className="font-bold"
                      style={{
                        fontSize: height / 35,
                      }}
                    >
                      It may be a good opportunity to learn !
                    </h5>
                    <div
                      className="flex flex-col gap-2"
                      style={{
                        fontSize: height / 40,
                      }}
                    >
                      <p>
                        It looks like you could improve your chances of success
                        in this situation.
                      </p>
                      <p>
                        Try to spend some time understanding the position and
                        the benefits of the move you have selected in your
                        repertoire.
                      </p>
                    </div>
                  </>
                ) : infoMessage === "" ? (
                  <>
                    <h5
                      className="font-bold"
                      style={{
                        fontSize: height / 35,
                      }}
                    >
                      Oops !
                    </h5>

                    <div
                      className="flex flex-col gap-2"
                      style={{
                        fontSize: height / 40,
                      }}
                    >
                      <p>You can do better !</p>
                      <p>Try to remember the good move for the next time !</p>
                    </div>
                  </>
                ) : (
                  infoMessage
                )}
              </div>
            )}
            {trainerState === "success" && (
              <div className="relative flex flex-col items-center justify-center bg-zinc-300/80 text-center text-gray-600 shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-400">
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-700"></span>
                <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-700"></span>

                {isCheckBadgeEarned(true) ? (
                  <>
                    <h5
                      className="flex items-center font-bold text-emerald-600/70"
                      style={{
                        marginTop: height / 25,
                        fontSize: height / 35,
                      }}
                    >
                      <Icon
                        name="CheckBadge"
                        style={{
                          width: width / 16,
                          height: height / 16,
                        }}
                      />
                      Congratulations !
                    </h5>

                    <div
                      className="flex flex-col"
                      style={{
                        marginBottom: height / 45,
                        fontSize: height / 40,
                      }}
                    >
                      <p>It looks like you mastered this line.</p>
                      <p>You could try adding new variants to it !</p>
                    </div>
                  </>
                ) : (
                  <>
                    <h5
                      className="flex items-center font-bold text-emerald-600/70"
                      style={{
                        marginTop: height / 25,
                        fontSize: height / 35,
                      }}
                    >
                      <Icon
                        style={{
                          width: width / 16,
                          height: height / 16,
                        }}
                        name="CheckCircle"
                      />
                      Good !
                    </h5>

                    <div
                      className="flex flex-col"
                      style={{
                        marginBottom: height / 45,
                        fontSize: height / 40,
                      }}
                    >
                      <p>Continue on this path to get the success badge !</p>
                    </div>
                  </>
                )}
                {infoMessage ? (
                  <div className="w-full bg-orange-300">
                    <div className="relative">
                      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-700"></span>
                      <div
                        style={{
                          fontSize: height / 45,
                        }}
                        className="absolute top-1 z-10 w-fit rounded-br-full rounded-tl-xl border-b border-r border-gray-400/80 bg-red-600/70 pl-1 pr-4 text-gray-800/80 shadow-inner dark:border-gray-500/80 dark:bg-red-900 dark:text-gray-300"
                      >
                        Unfinished Line
                      </div>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center rounded-xl bg-zinc-300/80 px-8 pb-2 text-orange-700/90 shadow-inner dark:border-zinc-800 dark:bg-zinc-300/80">
                      <p
                        style={{
                          marginTop: height / 18,
                          fontSize: height / 40,
                        }}
                      >
                        {infoMessage}
                        <br />
                        CRC aims to decrease the likelihood of this position
                        appearing in your training sessions.
                      </p>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
        </div>
      </RepertoireSideLayout>
    </>
  )
}

export default RepertoireTrainer
