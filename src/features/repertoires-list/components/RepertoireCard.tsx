import { useEffect, useState } from "react"

import { CloudArrowUpIcon } from "@heroicons/react/20/solid"
import dynamic from "next/dynamic"

import { useApi } from "@/features/api/providers/ApiProvider"
import { useAppContext } from "@/features/context/providers/AppContextProvider"
import { Icon } from "@/features/common/utils/icons"
import {
  ChessRepertoire,
  RepertoireStateAction,
} from "../../../types/Repertoire"
import ConfirmDeleteRepertoireModal from "./ConfirmDeleteRepertoireModal"
import RenameRepertoireModal from "./RenameRepertoireModal"
import RepertoireCardEditMenu from "./RepertoireCardEditMenu"
import { useAuthenticationState } from "@/features/auth/providers/AuthenticationStateProvider"
import { useRepertoireStoreOperations } from "../hooks/useRepertoireStoreOperations"
import { exportRepertoireToPgn } from "@/features/chess/lines/utils/repertoireExport"
import ExportModal from "@/features/common/components/ExportModal"
import { useRepertoireProvider } from "@/features/repertoire/providers/RepertoireProvider"

const MiniBoard = dynamic(
  () => import("@/features/chess/board/components/MiniBoard"),
  {
    ssr: false,
  },
)
function RepertoireCard({ repertoire }: { repertoire: ChessRepertoire }) {
  const { setRepertoireModule, openings } = useAppContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false)
  const [isCardActionMenuOpen, setIsCardActionMenuOpen] = useState(undefined)
  const { deleteRepertoire, loadRepertoire } = useRepertoireStoreOperations()

  const [renameModalIsOpen, setRenameModalIsOpen] = useState(false)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
  const { authenticationState } = useAuthenticationState()

  const [showQuickExportModal, setShowQuickExportModal] = useState(false)
  const [exportPgnContent, setExportPgnContent] = useState("")
  const { repertoire: loadedRepertoire } = useRepertoireProvider()

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

  const handleQuickExport = async () => {
    setIsMenuOpen(false)

    try {
      const { convertRepertoireToChessLine } = await import(
        "@/features/chess/lines/utils/repertoireConverter"
      )

      setShowQuickExportModal(true)
      await loadRepertoire(repertoire.id)

      const { root, transpositionIndex } = convertRepertoireToChessLine(
        loadedRepertoire.current,
        openings,
        50,
      )

      if (!root) {
        setExportPgnContent("Error: Failed to convert repertoire")
        return
      }

      // ✅ Fixed parameter order with repertoire info
      const pgnContent = exportRepertoireToPgn(
        root,
        loadedRepertoire.current, // ✅ Pass loaded repertoire for enhanced headers
        new Date().toISOString(),
      )

      if (
        !pgnContent ||
        pgnContent.trim() === "" ||
        pgnContent.trim() === "*"
      ) {
        setExportPgnContent(
          "No moves in repertoire - please add some moves first",
        )
      } else {
        setExportPgnContent(pgnContent)
      }
    } catch (error) {
      setExportPgnContent(`Error generating PGN: ${error.message}`)
    }
  }

  function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsMenuOpen(false)
    setIsDemoMenuOpen(false)
    setIsCardActionMenuOpen(undefined)

    if (e.target.getAttribute("role") === "Rename") {
      setRenameModalIsOpen(true)
    } else if (e.target.getAttribute("role") === "Delete") {
      setDeleteModalIsOpen(true)
    } else if (e.target.getAttribute("role") === "Export") {
      handleQuickExport()
    }
  }

  useEffect(() => {
    if (isMenuOpen || isDemoMenuOpen || isCardActionMenuOpen) {
      document.addEventListener("click", handleClick)
      document.addEventListener("mousedown", handleClick)
      // document.addEventListener("touchstart", handleClick)
    } else {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("mousedown", handleClick)
      // document.removeEventListener("touchstart", handleClick)
    }

    // document.addEventListener("contextmenu", handleContextMenu)
    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("mousedown", handleClick)
      // document.removeEventListener("touchstart", handleClick)
      // document.removeEventListener("contextmenu", handleContextMenu)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuOpen, isDemoMenuOpen, isCardActionMenuOpen])

  return (
    <>
      {renameModalIsOpen ? (
        <RenameRepertoireModal
          isOpen={renameModalIsOpen}
          repertoireId={repertoire.id}
          oldName={repertoire.title}
          cancelFunc={() => {
            setRenameModalIsOpen(false)
          }}
        />
      ) : (
        <></>
      )}
      {deleteModalIsOpen ? (
        <ConfirmDeleteRepertoireModal
          isOpen={deleteModalIsOpen}
          rid={repertoire.id}
          name={repertoire.title}
          cancelFunc={() => {
            setDeleteModalIsOpen(false)
          }}
          deleteRepertoire={deleteRepertoire}
        />
      ) : (
        <></>
      )}
      <ExportModal
        isOpen={showQuickExportModal}
        onClose={() => setShowQuickExportModal(false)}
        title={`Export "${repertoire.title}"`}
        pgnContent={exportPgnContent}
        filename={`${repertoire.title || "repertoire"}_${new Date().toISOString().split("T")[0]}.pgn`}
        onDownload={downloadPgnFile}
      />
      <div
        onClick={(e) => {
          if (repertoire.state.action === RepertoireStateAction.IDLE) {
            setRepertoireModule(repertoire.id, "builder")
          } else if (isCardActionMenuOpen) {
            setIsCardActionMenuOpen(undefined)
          } else if (
            repertoire.state.action === RepertoireStateAction.CREATING
          ) {
            setIsCardActionMenuOpen("creatingMenu")
            e.preventDefault()
            e.stopPropagation()
          } else if (
            repertoire.state.action === RepertoireStateAction.IMPORTING
          ) {
            setIsCardActionMenuOpen("importingMenu")
            e.preventDefault()
            e.stopPropagation()
          }
        }}
        className={
          "relative mx-auto flex w-full cursor-pointer select-none justify-between overflow-hidden rounded-lg border border-gray-300 bg-zinc-200 text-gray-500 shadow-sm ring-1 ring-slate-900/10 transition duration-500 ease-in-out hover:shadow-lg dark:divide-gray-500 dark:border-gray-500 dark:bg-zinc-900 dark:text-gray-400 dark:ring-0" +
          (repertoire.state.action !== RepertoireStateAction.IDLE
            ? " animate-pulse cursor-wait"
            : "")
        }
      >
        <div
          className={
            repertoire.color === "w"
              ? "h-full w-[8px] border-b border-r border-gray-300 bg-stone-100/80 shadow-inner dark:border-gray-500 dark:bg-zinc-200/90"
              : "h-full w-[8px] border-b border-r border-gray-500 bg-stone-700/80 shadow-inner dark:border-gray-500 dark:bg-zinc-800"
          }
        ></div>
        <div className="m-1 flex shrink-0 overflow-hidden rounded-md border-2 border-gray-300 shadow-sm ring-1 ring-slate-900/20 dark:border-gray-500 dark:ring-0">
          <MiniBoard
            fen={repertoire.startingPosition}
            orientation={repertoire.color === "w" ? "white" : "black"}
          />
        </div>
        <div className="flex w-full flex-col">
          {isCardActionMenuOpen !== undefined && CardActionMenu()}
          <div className="relative flex h-7 justify-end">
            {repertoire.state.action !== RepertoireStateAction.IDLE && (
              <div
                className="mx-2 flex h-6 w-6 items-center justify-center self-center rounded-full border-gray-400/50 shadow-sm dark:border-gray-500"
                onClick={(e) => {
                  if (
                    repertoire.state.action === RepertoireStateAction.IMPORTING
                  ) {
                    setIsCardActionMenuOpen("importingMenu")
                  } else if (
                    repertoire.state.action === RepertoireStateAction.CREATING
                  ) {
                    setIsCardActionMenuOpen("creatingMenu")
                  }
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <div className="relative">
                  <div
                    className="h-5 w-5 animate-spin rounded-full
                            border-2 border-solid border-indigo-500 border-t-transparent"
                  ></div>
                </div>
              </div>
            )}
            {repertoire.state.demo && (
              <div
                className="mx-2 flex h-6 w-6 items-center justify-center self-center rounded-full border-gray-400/50 bg-orange-100 shadow-sm dark:border-gray-500"
                onClick={(e) => {
                  setIsCardActionMenuOpen("demoMenu")
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <Icon
                  name="Unlink"
                  className="h-4 w-4 text-orange-700 "
                  fill="currentColor"
                />
              </div>
            )}
            {isMenuOpen ? (
              <>
                <RepertoireCardEditMenu />
                <div
                  id="editButton"
                  className="absolute right-[-2px] z-10 h-[74px] w-12 border-b border-l border-gray-400/50 bg-zinc-200 shadow-inner dark:border-gray-500 dark:bg-zinc-700"
                >
                  <div className="flex h-full items-center justify-center bg-zinc-300/50 hover:bg-zinc-300/90 dark:bg-zinc-700 dark:hover:bg-zinc-600/90">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={(e) => {
                        setIsMenuOpen(false)
                      }}
                      className="h-7 w-12 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </div>
                </div>
              </>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (
                    repertoire.state.action === RepertoireStateAction.CREATING
                  ) {
                    setIsCardActionMenuOpen("creatingMenu")
                  } else if (
                    repertoire.state.action === RepertoireStateAction.IMPORTING
                  ) {
                    setIsCardActionMenuOpen("importingMenu")
                  } else {
                    setIsMenuOpen(true)
                  }
                }}
                className="right-[-2px]  z-10 h-7 w-12 rounded-bl-xl border-l border-gray-400/50 bg-zinc-300/50 shadow-sm hover:bg-zinc-300/90 dark:border-gray-500 dark:bg-zinc-700/80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
            )}
          </div>
          <div className="py-2 pr-2 text-center text-xs font-medium sm:text-sm">
            {repertoire.title}
          </div>
        </div>
        <div
          className={
            repertoire.color === "w"
              ? "z-20 h-full w-[8px] self-end border-l border-t border-gray-300 bg-stone-100/80 shadow-inner dark:border-gray-500 dark:bg-zinc-200/90"
              : "z-20 h-full w-[8px] self-end border-l border-t border-gray-500 bg-stone-700/80 shadow-inner dark:border-gray-500 dark:bg-zinc-800"
          }
        ></div>
      </div>
    </>
  )

  function CardActionMenu() {
    switch (isCardActionMenuOpen) {
      case "demoMenu":
        return (
          <div
            onClick={(e) => {
              setIsMenuOpen(false)
              setIsCardActionMenuOpen(undefined)
            }}
            className="absolute right-[0px] z-50 flex w-full border-b border-l-4 border-orange-500 bg-orange-100 xs:py-2 py-1 px-2 text-orange-700 shadow-inner"
          >
            {repertoire.state.action === RepertoireStateAction.IMPORTING ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold">
                  <div
                    className="h-5 w-5 animate-spin rounded-full
                            border-2 border-solid border-indigo-500 border-t-transparent"
                  ></div>
                  Import in progress
                </div>
                <div>
                  Your new repertoire is being imported, please be patient...
                </div>
              </div>
            ) : (
              <div className="flex flex-col xs:gap-2 gap-1">
                <p className="flex items-center gap-2 font-bold xs:text-md text-sm">
                  <Icon
                    name="Unlink"
                    className="h-4 w-4 text-orange-700 "
                    fill="currentColor"
                  />
                  Temporary Repertoire !
                </p>
                <p className="text-sm">
                  You created this repertoire in demo mode, it is only stored
                  locally and will eventually disappear
                </p>
                {authenticationState.isAuthenticated ? (
                  <div className="flex w-full justify-center">
                    <button
                      type="button"
                      role="Upload"
                      className="inline-flex items-center gap-x-1.5 rounded-md border-1 border-indigo-500 bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <CloudArrowUpIcon
                        className="-ml-0.5 h-5 w-5"
                        aria-hidden="true"
                      />
                      Import Online
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
        )
      case "creatingMenu":
        return (
          <div
            onClick={(e) => {
              setIsMenuOpen(false)
              setIsCardActionMenuOpen(undefined)
            }}
            className="absolute right-[0px] z-50 flex w-full border-b border-l-4 border-indigo-500 bg-indigo-100 p-2 text-indigo-700 shadow-inner"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold">
                <div
                  className="h-5 w-5 animate-spin rounded-full
                            border-2 border-solid border-indigo-500 border-t-transparent"
                ></div>
                Creation in progress
              </div>
              <div>
                Your new repertoire is being created, please be patient...
              </div>
            </div>
          </div>
        )
      case "importingMenu":
        return (
          <div
            onClick={(e) => {
              setIsMenuOpen(false)
              setIsCardActionMenuOpen(undefined)
            }}
            className="absolute right-[0px] z-50 flex w-full border-b border-l-4 border-indigo-500 bg-indigo-100 p-2 text-indigo-700 shadow-inner"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold">
                <div
                  className="h-5 w-5 animate-spin rounded-full
                            border-2 border-solid border-indigo-500 border-t-transparent"
                ></div>
                Import in progress
              </div>
              <div>
                Your new repertoire is being imported, please be patient...
              </div>
            </div>
          </div>
        )
    }
  }
}

export default RepertoireCard
