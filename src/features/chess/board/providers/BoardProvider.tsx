import React, { RefObject, useState } from "react"

import { Api } from "chessground/api"

import { useChessProvider } from "../../logic/providers/ChessProvider"
import { RepertoireMode } from "@/types/Repertoire"

interface BoardContextInterface {
  ref: RefObject<any>
  boardApi: RefObject<Api>
  boardConfig: any
  setBoardConfig: React.Dispatch<any>
  playTemporaryMoves: Function
  resetBoard: Function
  updateBoard: Function
  adaptBoardOrientation: Function
}
// create new context
const Context = React.createContext<BoardContextInterface | null>(null)

export default function BoardProvider({ children }) {
  const { getConfigFromChess } = useChessProvider()

  const [boardConfig, setBoardConfig] = useState(getConfigFromChess())

  function updateBoard(mode: RepertoireMode = RepertoireMode.BUILD) {
    if (mode === RepertoireMode.BUILD) {
      setBoardConfig(getConfigFromChess(true, false))
    } else {
      setBoardConfig(getConfigFromChess)
    }
  }

  function adaptBoardOrientation(repertoireColor) {
    if (
      repertoireColor === "b" &&
      (boardConfig.orientation === "white" || !boardConfig.orientation)
    ) {
      // Get the boardConfiguration from the chess provider
      let conf = getConfigFromChess()
      // Set the orientation to black
      conf.orientation = "black"
      // Update the boardConfiguration state variable
      setBoardConfig(conf)
      // Check if the current repertoire color is white and the boardConfiguration orientation is black
    } else if (repertoireColor === "w" && boardConfig.orientation === "black") {
      // Get the boardConfiguration from the chess provider
      let conf = getConfigFromChess()
      // Set the orientation to white
      conf.orientation = "white"
      // Update the boardConfiguration state variable
      setBoardConfig(conf)
    }
  }

  const ref = React.useRef<HTMLDivElement>(null)

  const boardApi = React.useRef<Api | null>(null)

  function playTemporaryMoves(moves) {
    moves.forEach((move) => {
      boardApi.current.move(move.from, move.to)
    })
  }

  function resetBoard() {
    boardApi.current.set(getConfigFromChess())
  }

  return (
    <Context.Provider
      value={{
        ref,
        boardApi,
        playTemporaryMoves,
        resetBoard,
        boardConfig,
        setBoardConfig,
        updateBoard,
        adaptBoardOrientation,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export function useBoardProvider() {
  return React.useContext(Context)
}
