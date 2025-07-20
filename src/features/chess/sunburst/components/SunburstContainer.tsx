import { useState } from "react"

import { useChessProvider } from "@/features/chess/logic/providers/ChessProvider"

import { useBuildModeLogic } from "@/features/repertoire/hooks/useBuildModeLogic"
import { useBoardProvider } from "@/features/chess/board/providers/BoardProvider"
import { getLastMove } from "@/features/chess/logic/utils/moveUtils"
import { useSunburst } from "../hooks/useSunburst"
import { displayMoveWithPiece } from "@/features/common/utils/displayUtils"
import Sunburst from "./Sunburst"
import { getWidthAndHeight } from "@/features/common/utils/helpers"

const SunburstContainer = () => {
  const { undo, handleSunburstSelection, deleteMoveFromRepertoire } =
    useBuildModeLogic()
  // Get the chess instance and boardConfiguration from the chess provider
  const { chess, getFen } = useChessProvider()
  const { boardApi, boardConfig, playTemporaryMoves, updateBoard } =
    useBoardProvider()
  const [width, height] = getWidthAndHeight()
  const [showMenu, setShowMenu] = useState(false)

  // Get the last three moves from the lines data
  let lastMove = getLastMove(chess)
  let lastMove2 = getLastMove(chess, 2)
  let lastMove3 = getLastMove(chess, 3)

  const { sunBurstData, prevSunBurstData, updateSunburstData } = useSunburst()

  if (!sunBurstData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>Loading sunburst...</div>
      </div>
    )
  }

  /**
   * Returns the JSX element for the sunburst center control.
   * The function displays the last three moves and the current turn color.
   * If there are no moves in the repertoire, the function displays the current turn color.
   * @returns The JSX element for the sunburst center control.
   */
  function sunburstCenterControl() {
    return (
      <div className="pointer-events-none absolute z-30 flex h-full w-full flex-col justify-center">
        <div className="flex h-1/3 w-full select-none justify-center">
          {(() => {
            let toReturn = []
            if (lastMove) {
              // If there is a last move, display the last three moves
              toReturn.push(
                <div
                  key="undo"
                  className="flex h-full w-full items-center justify-center  text-gray-400/80"
                >
                  <div className="flex w-1/3 justify-center text-sm"></div>

                  <div className="flex h-full w-1/3 flex-col items-center justify-center text-gray-400/80">
                    <div className="flex items-center">
                      {lastMove3
                        ? displayMoveWithPiece(lastMove3, 40, width, height, {
                            fontSize: width / 40,
                          })
                        : lastMove2
                          ? "..."
                          : ""}
                    </div>

                    <div
                      className={
                        boardConfig.turnColor === "black"
                          ? "flex items-center text-black"
                          : "flex items-center text-white"
                      }
                    >
                      {lastMove2
                        ? displayMoveWithPiece(lastMove2, 35, width, height, {
                            fontSize: width / 35,
                          })
                        : "..."}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ width: width / 40, height: height / 40 }}
                      className={
                        boardConfig.turnColor === "black"
                          ? "rotate-90 animate-pulse rounded-full bg-black text-white"
                          : " rotate-90 animate-pulse rounded-full bg-white text-black"
                      }
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                      />
                    </svg>
                    <div className="flex items-center text-lime-500/70">
                      {displayMoveWithPiece(lastMove, 20, width, height)}
                    </div>
                  </div>
                  <div className="w-1/3"></div>
                </div>,
              )
            }
            if (sunBurstData.children.length === 0) {
              // If there are no moves in the repertoire, display the current turn color
              if (boardConfig.turnColor === "white") {
                toReturn.push(
                  <div
                    key="wtp"
                    className="absolute top-[-43px] flex flex-col items-center justify-center text-center text-[0.75rem]"
                  >
                    <div className="h-4 w-4 rounded-full border-2 border-gray-400 bg-white" />
                    <span>White to play</span>
                  </div>,
                )
              } else {
                toReturn.push(
                  <div
                    key="btp"
                    className="absolute top-[-43px] flex flex-col items-center justify-center text-center text-[0.75rem]"
                  >
                    <div className="h-4 w-4 rounded-full border-2 border-white bg-black" />
                    <span>Black to play</span>
                  </div>,
                )
              }
            }

            return (
              <div className="relative flex w-1/3 items-center justify-center rounded-full text-gray-500">
                {toReturn.map((c) => c)}
              </div>
            )
          })()}
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full justify-center">
      {sunburstCenterControl()}
      <Sunburst
        data={sunBurstData}
        prevData={prevSunBurstData}
        fen={getFen()}
        updateData={updateSunburstData}
        onSelect={handleSunburstSelection}
        onContextMenu={(event, d) => {
          // Prevent the default context menu
          event.preventDefault()
          // Stop the event from propagating
          event.stopPropagation()

          let shapes = []
          let moves = []
          if (d.depth === 2) {
            // If the depth of the data is 2, add the parent move to the moves array
            moves.push(d.parent.data.move)
          }
          // Add the current move to the moves array
          moves.push(d.data.move)

          // Add the shape to the shapes array
          shapes.push({
            orig: d.data.move.from,
            dest: d.data.move.to,
            modifiers: {
              lineWidth: 6,
            },
            brush: d.data.move.suggestion ? "green" : "blue",
          })

          // Play the temporary moves and set the auto shapes
          playTemporaryMoves(moves)
          boardApi.current.setAutoShapes(shapes)
          setShowMenu(d.data)
        }}
        deleteMoveFromRepertoire={(fen, move) => {
          deleteMoveFromRepertoire(fen, move)
          updateSunburstData(getFen(), lastMove)
          updateBoard()
        }}
        undo={undo}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />
    </div>
  )
}

export default SunburstContainer
