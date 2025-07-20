import { useEffect, useState } from "react"

import HexagonMenu from "../../menu/components/HexagonMenu"
import { useChessProvider } from "../../chess/logic/providers/ChessProvider"
import { useRepertoireProvider } from "../providers/RepertoireProvider"
import { getWidthAndHeight } from "@/features/common/utils/helpers"
import { Icon } from "@/features/common/utils/icons"
import { RepertoireMode } from "../../../types/Repertoire"
import { findOpeningNameForPgn } from "@/features/chess/logic/utils/openingsUtils"
import { useAppContext } from "@/features/context/providers/AppContextProvider"

export default function RepertoireSideLayout({ children, pgn }) {
  const [width, height] = getWidthAndHeight()
  const { repertoire, mode, setMode, setQuickTrainPosition } =
    useRepertoireProvider()
  const { chess, getOpeningName, getTurnNumberFromChessHistory } =
    useChessProvider()
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false)
  const { openings } = useAppContext() // Accessing openings data from the AppContextProvider.

  const [opening, setOpening] = useState(findOpeningNameForPgn(pgn, openings))

  const fontSize = width / 28 > 23 ? 23 : width / 28

  function toggleMenu() {
    setIsMainMenuOpen(!isMainMenuOpen)
  }
  const designIcon = (
    <Icon
      className="fill-current text-gray-600 dark:text-gray-400"
      name="Design"
      style={{ width: width / 11, height: height / 11 }}
    />
  )
  const targetIcon = (
    <Icon
      className="fill-current text-gray-600 dark:text-gray-400"
      name="Target"
      style={{ width: width / 13, height: height / 13 }}
    />
  )

  const defaultStyle = { width: width / 9, height: height / 9 }

  const tabSelector = (
    icon,
    className,
    onClick = null,
    style = defaultStyle,
  ) => {
    if (onClick !== null) {
      return (
        <div onClick={onClick} style={style} className={className}>
          {icon}
        </div>
      )
    } else {
      return (
        <div style={style} className={className}>
          {icon}
        </div>
      )
    }
  }

  useEffect(() => {
    setOpening(findOpeningNameForPgn(pgn, openings))
  }, [pgn])

  return (
    <section
      className="relative"
      style={{
        height: height,
        width: width,
      }}
    >
      {isMainMenuOpen ? (
        <HexagonMenu
          closeMenu={() => {
            toggleMenu()
          }}
        />
      ) : (
        <div
          className="flex flex-col"
          style={{
            height: height,
            width: width,
          }}
        >
          <header className="z-30 flex w-full" style={{ height: height / 9 }}>
            {mode === RepertoireMode.BUILD ? (
              <div className="flex">
                {tabSelector(
                  designIcon,
                  "pointer-events-auto top-0 left-0 flex cursor-pointer items-center justify-center rounded-bl-xl border-r border-gray-400 bg-indigo-300 shadow-md dark:border-gray-500 dark:bg-indigo-700",
                )}
                {tabSelector(
                  targetIcon,
                  "pointer-events-auto top-0 flex cursor-pointer items-center justify-center rounded-br-xl border-r border-gray-400 bg-zinc-300 shadow-md hover:bg-zinc-400 dark:border-gray-500 dark:bg-zinc-700 dark:hover:bg-zinc-600",
                  () => {
                    setQuickTrainPosition({
                      pgn: chess.pgn(),
                      name:
                        chess.history().length === 0
                          ? "Starting position"
                          : getOpeningName(),
                      turn: getTurnNumberFromChessHistory(),
                    })
                    setMode(RepertoireMode.TRAIN)
                  },
                )}
              </div>
            ) : (
              <div className="flex">
                {tabSelector(
                  designIcon,
                  "pointer-events-auto top-0 left-0 flex cursor-pointer items-center justify-center rounded-bl-xl border-r border-gray-400 bg-zinc-300 shadow-md hover:bg-zinc-400 dark:border-gray-500 dark:bg-zinc-700 dark:hover:bg-zinc-600",
                  () => {
                    setMode(RepertoireMode.BUILD)
                  },
                )}
                {tabSelector(
                  targetIcon,
                  "pointer-events-auto top-0 flex cursor-pointer items-center justify-center rounded-br-xl border-r border-gray-400 bg-emerald-600/40 shadow-md dark:border-gray-500 dark:bg-emerald-700",
                )}
              </div>
            )}
            <div
              className="flex h-full w-full flex-col text-gray-600 dark:text-gray-400"
              style={{
                fontSize: width / 40,
                height: height / 9,
                marginLeft: width / 80,
              }}
            >
              <p className="h-1/3 font-bold">{repertoire.current.title}</p>

              {mode === RepertoireMode.BUILD ? (
                <p
                  className="font-semibold text-indigo-500"
                  style={{
                    fontSize: width / 50,
                    lineHeight: height / 1000,
                  }}
                >
                  Build Mode
                </p>
              ) : (
                <p
                  className="font-semibold text-emerald-600"
                  style={{
                    lineHeight: height / 1000,

                    fontSize: width / 50,
                  }}
                >
                  Train Mode
                </p>
              )}
              {(() => {
                if (opening) {
                  return (
                    <div
                      className="flex h-1/3 items-center"
                      style={{
                        marginTop: width / 80,
                        fontSize: width / 50,
                      }}
                    >
                      <Icon
                        name="Book"
                        className="fill-gray-600 dark:fill-gray-400"
                        style={{
                          width: width / 40,
                          height: height / 40,
                          marginRight: width / 150,
                        }}
                      />
                      <p>{opening}</p>
                    </div>
                  )
                } else {
                  return <p></p>
                }
              })()}
            </div>

            <div className="flex h-full">
              <div
                onClick={toggleMenu}
                style={defaultStyle}
                className="pointer-events-auto right-0 top-0 flex cursor-pointer items-center justify-center rounded-bl-xl border-l border-gray-400 bg-zinc-300 shadow-md hover:bg-zinc-400 dark:border-gray-500 dark:bg-zinc-700 dark:hover:bg-zinc-600"
              >
                <Icon
                  className="text-gray-500 dark:text-gray-400"
                  name="Menu"
                  style={{ width: width / 11, height: height / 12 }}
                />
              </div>
            </div>
          </header>
          <main
            className="relative flex h-full flex-col"
            style={{ height: height - height / 9 }}
          >
            <div
              className="absolute z-30 flex cursor-pointer select-none items-center justify-center gap-1 "
              style={{
                left: width / 60,
                top: height / 150,
                fontSize: fontSize,
              }}
            >
              <label className="font-bold text-gray-500 dark:text-gray-400">
                TURN
              </label>
              <div
                className={
                  (chess.turn() === "w"
                    ? "border-gray-400/50 bg-gray-100 text-gray-500 dark:bg-gray-200 dark:text-gray-500 "
                    : "border-gray-400/50 bg-zinc-800 text-gray-200 dark:bg-zinc-800 dark:text-gray-200 ") +
                  "rounded-md border px-2 font-bold shadow-inner outline-none select-none"
                }
              >
                {getTurnNumberFromChessHistory()}
              </div>
            </div>

            {children}
          </main>
        </div>
      )}
    </section>
  )
}
