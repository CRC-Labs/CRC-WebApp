import { useEffect, useState } from "react"

import Board from "@/features/chess/board/components/Board"
import { useChessProvider } from "@/features/chess/logic/providers/ChessProvider"
import { useBoardProvider } from "@/features/chess/board/providers/BoardProvider"
import ChessLinesTree from "@/features/chess/lines/components/ChessLinesTree"
import { getNextMove } from "@/features/chess/logic/utils/moveUtils"
import { useChessNavigation } from "@/features/chess/navigation/hooks/useChessNavigation"
import SunburstContainer from "@/features/chess/sunburst/components/SunburstContainer"
import { Icon } from "@/features/common/utils/icons"
import {
  validatePanelIndex,
  getPanel,
} from "@/features/common/utils/panelUtils"
import { useBuildModeLogic } from "../hooks/useBuildModeLogic"
import { useRepertoireLinesLogic } from "../hooks/useRepertoireLinesLogic"
import { useRepertoireProvider } from "../providers/RepertoireProvider"
import RepertoireSideLayout from "./RepertoireSideLayout"
import { exportRepertoireToPgn } from "@/features/chess/lines/utils/repertoireExport"
import ExportModal from "@/features/common/components/ExportModal"

const panels = [
  { name: "sunburst", icon: "Sunburst" },
  { name: "treeview", icon: "TreeView" },
  { name: "repertoireInfo", icon: "Info" },
]

// Define the RepertoireBuilder component
const BuildModeContainer = ({ width, height }) => {
  const { loadPgn, handleBoardMove } = useBuildModeLogic()
  const { repertoire, repertoireVersion, transpositionIndex } =
    useRepertoireProvider()
  const { linesData } = useRepertoireLinesLogic()
  // Get the chess instance and boardConfiguration from the chess provider
  const { chess, getConfigFromChess, getTurnNumberFromChessHistory } =
    useChessProvider()
  const { boardConfig, setBoardConfig, adaptBoardOrientation, updateBoard } =
    useBoardProvider()
  // Get the repertoire, lines data, and repertoire management functions from the repertoire manager

  const { navigateToPreviousMove, navigateToNextMove } =
    useChessNavigation(repertoire)

  const [showExportModal, setShowExportModal] = useState(false)

  // ✅ Simplified - download logic moved to shared function
  const downloadPgnFile = (pgn: string, filename: string) => {
    const blob = new Blob([pgn], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExportRepertoire = () => {
    setShowExportModal(true)
  }

  const handleBackToTop = () => {
    chess.reset()
    setBoardConfig(getConfigFromChess())
    // ✅ Add a small delay to ensure tree reacts to the change
    setTimeout(() => {
      // This ensures the tree effect runs after the board state is updated
    }, 50)
  }

  // Check if the current repertoire color is black and the boardConfiguration orientation is white or not set
  useEffect(() => {
    adaptBoardOrientation(repertoire.current.color)
  }, [repertoire.current.color, adaptBoardOrientation])

  // Mise à jour de la configuration via des événements clavier (navigation)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Exclure par exemple la saisie dans un champ de recherche
      if (document.activeElement?.id === "search") return
      if (event.key === "ArrowLeft") {
        navigateToPreviousMove()
      } else if (event.key === "ArrowRight") {
        navigateToNextMove()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [navigateToPreviousMove, navigateToNextMove])

  useEffect(() => {
    updateBoard()
  }, [repertoireVersion])

  // Define state variables for the panel and menu visibility
  const [panel, _setPanel] = useState(0)

  function navigationControls() {
    return (
      <div
        style={{
          left: width / 6 + width / 9 + 18,
          height: height / 9,
          width: width - width / 3 - width / 9 - width / 9 - 24,
          gap: width / 64,
        }}
        className="absolute bottom-1 flex h-1/3 items-center justify-center rounded-2xl border border-gray-400/50  bg-zinc-400/40 shadow-md dark:border-gray-500 dark:bg-zinc-500/80"
      >
        <div
          onClick={() => {
            navigateToPreviousMove()
          }}
          style={{
            width: width / 10,
            height: height / 10,
            paddingRight: width / 140,
          }}
          className={`${chess.history().length > 0 ? "" : "opacity-20 "}pointer-events-auto relative flex cursor-pointer select-none flex-col items-center justify-center rounded-full border border-gray-400/50 bg-zinc-300/50 shadow-md dark:border-gray-500 dark:bg-zinc-700/80`}
        >
          <Icon
            className="absolute rotate-180 text-gray-500 dark:text-gray-400"
            name="Play"
            style={{
              width: width / 20,
              height: height / 20,
            }}
          />
        </div>
        <div
          onClick={() => {
            navigateToNextMove()
          }}
          style={{
            width: width / 10,
            height: height / 10,
            paddingLeft: width / 140,
          }}
          className={`${getNextMove(repertoire, chess) !== null ? "" : "opacity-20 "}pointer-events-auto relative flex cursor-pointer select-none flex-col items-center justify-center rounded-full border border-gray-400/50 bg-zinc-300/50 shadow-md dark:border-gray-500 dark:bg-zinc-700/80`}
        >
          <Icon
            className="absolute  text-gray-500 dark:text-gray-400"
            name="Play"
            style={{
              width: width / 20,
              height: height / 20,
            }}
          />
        </div>
      </div>
    )
  }

  /**
   * Sets the active panel to the panel at the given index.
   * If the index is -1, sets the active panel to the last panel.
   * If the index is equal to the number of panels, sets the active panel to the first panel.
   * If the index is less than 0 or greater than or equal to the number of panels, does nothing.
   * @param value The index of the panel to set as active.
   */
  function setPanel(value: number): void {
    const validatedIndex = validatePanelIndex(value, panels.length)
    if (validatedIndex !== null) {
      _setPanel(validatedIndex)
    }
  }

  /**
   * Returns the JSX element for the side controls.
   * The function displays two buttons for navigating between panels.
   * The left button navigates to the previous panel and the right button navigates to the next panel.
   * The function uses the `panel` state to determine the current panel and the `getPanel` function to get the icon for each panel.
   * @returns The JSX element for the side controls.
   */
  function sideControls() {
    return (
      <div className="pointer-events-none absolute z-30 flex h-full w-full flex-col justify-between">
        <div className="flex h-1/3 w-full">
          <div className="relative h-full w-1/2">
            {(() => {
              // Display the left button to navigate to the previous panel
              if (panel === 0 && getTurnNumberFromChessHistory() > 1)
                return (
                  <div
                    onClick={handleBackToTop}
                    style={{
                      width: width / 8,
                      height: height / 8,
                      top: height / 16 + 5,
                      left: width / 60,
                    }}
                    className="pointer-events-auto absolute flex cursor-pointer select-none flex-col items-center justify-center rounded-full border border-gray-400/50 bg-zinc-300/50 shadow-md dark:border-gray-500 dark:bg-zinc-700/80"
                  >
                    <Icon
                      className="fill-current text-gray-500 dark:text-gray-400"
                      name="ChevronDoubleUp"
                      style={{ width: width / 20, height: height / 20 }}
                    />
                    <p
                      style={{ fontSize: width / 60 }}
                      className="text-center text-xs text-gray-500 dark:text-gray-400"
                    >
                      Back to top
                    </p>
                  </div>
                )
            })()}
          </div>
          <div className="relative h-full w-1/2"></div>
        </div>
        <div className="relative flex h-1/3 w-full">
          <div
            onClick={() => {
              setPanel(panel - 1)
            }}
            style={{ width: width / 6, height: height / 9 }}
            className="pointer-events-auto absolute bottom-1 left-1 flex cursor-pointer items-center justify-center rounded-2xl border border-gray-400/50 bg-zinc-300/50 shadow-md dark:border-gray-500 dark:bg-zinc-700/80"
          >
            <Icon
              className="text-gray-500 dark:text-gray-400"
              name="LeftChevron"
              style={{ width: width / 16, height: height / 16 }}
            />
            <Icon
              className="text-gray-500 dark:text-gray-400"
              name={getPanel(panel - 1, panels).icon}
              style={{ width: width / 16, height: height / 16 }}
            />
          </div>
          {panel !== 0 && getTurnNumberFromChessHistory() > 1 && (
            <div
              onClick={() => {
                chess.reset()
                setBoardConfig(getConfigFromChess())
              }}
              style={{
                width: width / 9,
                height: height / 9,
                left: width / 6 + 12,
                bottom: 4,
              }}
              className="pointer-events-auto absolute flex cursor-pointer select-none flex-col items-center justify-center rounded-full border border-gray-400/50 bg-zinc-300/50 shadow-md dark:border-gray-500 dark:bg-zinc-700/80"
            >
              <Icon
                className="absolute fill-current text-gray-500 dark:text-gray-400"
                name="ChevronDoubleUp"
                style={{
                  width: width / 25,
                  height: height / 25,
                  top: height / 50 - 1,
                }}
              />
              <p
                style={{
                  fontSize: width / 70,
                  bottom: -5 + height / 20 - height / 50,
                }}
                className="absolute text-center text-xs text-gray-500 dark:text-gray-400"
              >
                Back to top
              </p>
            </div>
          )}
          {panel !== 0 && navigationControls()}
          <div
            onClick={() => {
              setPanel(panel + 1)
            }}
            style={{ width: width / 6, height: height / 9 }}
            className="pointer-events-auto absolute bottom-1 right-1 flex cursor-pointer items-center justify-center rounded-2xl border border-gray-400/50 bg-zinc-300 shadow-md dark:border-gray-500 dark:bg-zinc-700"
          >
            <Icon
              className="text-gray-500 dark:text-gray-400"
              name={getPanel(panel + 1, panels).icon}
              style={{ width: width / 16, height: height / 16 }}
            />
            <Icon
              className="text-gray-500 dark:text-gray-400"
              name="RightChevron"
              style={{ width: width / 16, height: height / 16 }}
            />
          </div>
        </div>
      </div>
    )
  }

  /**
   * Returns the JSX element for the main content of the `RepertoireBuilder` component.
   * The function returns a `BoardProvider` component that wraps the `Board` component and the `Modal` component.
   * The `Board` component displays the chess board and the `Modal` component displays the modal content.
   * The function also returns the JSX elements for the side layout, which includes the `RepertoireSideLayout` component and the `sideControls` function.
   * The `RepertoireSideLayout` component displays the repertoire side layout and the `sideControls` function displays the side controls for navigating between panels.
   * The function uses the `panel` state to determine which panel to display and renders the appropriate JSX elements for each panel.
   * @returns The JSX element for the main content of the `RepertoireBuilder` component.
   */
  function mainContent() {
    return (
      <>
        <div
          className="relative"
          style={{
            height: height,
            width: width,
          }}
        >
          <Board config={boardConfig} afterMoveFunc={handleBoardMove} />
        </div>

        <RepertoireSideLayout pgn={chess.pgn()}>
          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            title="Export Repertoire"
            pgnContent={
              linesData
                ? exportRepertoireToPgn(
                    linesData,
                    repertoire.current,
                    new Date().toISOString(),
                  )
                : ""
            }
            filename={`${repertoire.current?.title || "repertoire"}_${new Date().toISOString().split("T")[0]}.pgn`}
            onDownload={downloadPgnFile}
          />

          <div className="relative h-full">
            {sideControls()}
            <div className="relative h-full">
              {panel === 0 && <SunburstContainer />}
              {panel === 1 && (
                <div
                  className="relative z-20 flex h-full w-full flex-col gap-2 overflow-hidden bg-stone-300 dark:bg-stone-900"
                  style={{
                    width: width,
                    height: height - 2 * (height / 9) - 5,
                  }}
                >
                  <div
                    className="flex"
                    style={{
                      width: width,
                      height: height - 2 * (height / 9) - 5,
                    }}
                  >
                    {linesData.children.length > 0 ? (
                      <ChessLinesTree pgn={chess.pgn()} loadPgn={loadPgn} />
                    ) : (
                      <div className="m-2 mt-12 h-fit w-full rounded-b-xl rounded-r-xl border border-gray-400/80 bg-zinc-200 p-4 text-center text-gray-500 dark:border-gray-500/80 dark:bg-zinc-700 dark:text-gray-400">
                        <p className="p-2">
                          You don't have any line yet, let's play a move
                        </p>
                        <div
                          key="wtp"
                          className="flex flex-col items-center justify-center border-t border-gray-500 pt-2 text-center text-[0.75rem]"
                        >
                          <div className="h-4 w-4 rounded-full border-2 border-gray-400/80 bg-white dark:border-gray-500/80" />
                          <span>White to play</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {panel === 2 && (
                <div
                  className="relative z-20 flex h-full w-full flex-col gap-2 overflow-hidden bg-stone-300 dark:bg-stone-900"
                  style={{
                    width: width,
                    height: height - 2 * (height / 9) - 5,
                  }}
                >
                  <div
                    className="absolute flex flex-col"
                    style={{
                      top: height / 20 + 15,
                      left: width / 60,
                      width: width,
                      height: height - 2 * (height / 9) - 5,
                    }}
                  >
                    {/* Export Button */}
                    <div className="flex mb-2">
                      <button
                        onClick={handleExportRepertoire}
                        className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                        style={{ fontSize: width / 60 }}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Export Repertoire
                      </button>
                    </div>

                    <div className="flex items-center">
                      <label
                        className="font-bold text-gray-500 dark:text-gray-400"
                        style={{
                          fontSize: width / 30,
                          width: width / 10,
                        }}
                      >
                        FEN
                      </label>
                      <div
                        style={{
                          fontSize: width / 50,
                        }}
                        className="select-all rounded-md border border-gray-400/50 bg-gray-300 px-4 py-1 text-gray-500 shadow-inner outline-none dark:bg-gray-700 dark:text-gray-400"
                      >
                        {chess.fen()}
                      </div>
                    </div>

                    <hr className="m-1 border-zinc-400/50 dark:border-zinc-800" />

                    <div className="flex items-center">
                      <label
                        className="font-bold text-gray-500 dark:text-gray-400"
                        style={{
                          fontSize: width / 30,
                          width: width / 10,
                        }}
                      >
                        PGN
                      </label>
                      <div
                        style={{
                          maxWidth: width - width / 9,
                          fontSize: width / 50,
                        }}
                        className="select-all rounded-md border border-gray-400/50 bg-gray-300 px-4 py-1 text-gray-500 shadow-inner outline-none dark:bg-gray-700 dark:text-gray-400"
                      >
                        {chess.pgn()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </RepertoireSideLayout>
      </>
    )
  }

  return mainContent()
}

export default BuildModeContainer
