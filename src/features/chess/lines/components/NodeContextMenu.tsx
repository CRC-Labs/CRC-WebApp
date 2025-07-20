// In NodeContextMenu.jsx
import { Icon } from "@/features/common/utils/icons"
import React, { useEffect, useState } from "react"
import { useBuildModeLogic } from "@/features/repertoire/hooks/useBuildModeLogic"
import { useMoveState } from "./MoveStateProvider"

import { PortalContextMenu } from "./PortalContextMenu"

const NodeContextMenu = ({ node, setContextMenu, moveContext = null }) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { setPendingDelete, clearPendingDelete } = useMoveState()
  const { deleteMove } = useBuildModeLogic()

  // Set pending delete when move context menu appears
  useEffect(() => {
    if (moveContext && !confirmDelete) {
      setTimeout(() => {
        setPendingDelete(
          moveContext.line.pgn,
          moveContext.moveIndex,
          moveContext.move,
        )
      }, 0)
    }
  }, [moveContext, confirmDelete, setPendingDelete])

  // Clear pending delete when component unmounts
  useEffect(() => {
    return () => {
      clearPendingDelete()
    }
  }, [clearPendingDelete])

  const handleShowConfirm = (e) => {
    e?.stopPropagation()
    setConfirmDelete(true)
    // Keep the pending delete highlight active
  }

  const handleCancel = (e) => {
    e?.stopPropagation()
    setConfirmDelete(false)
    clearPendingDelete()
    setContextMenu(null)
  }

  const handleDeleteConfirm = (e) => {
    e?.stopPropagation()

    if (moveContext) {
      deleteMove(moveContext.move)
    } else {
      if (node.data.moveSequence && node.data.moveSequence.length > 0) {
        const firstMove = node.data.moveSequence[0]
        deleteMove(firstMove)
      }
    }

    clearPendingDelete()
    setContextMenu(null)
    setConfirmDelete(false)
  }

  // Enhanced move context menu with confirm delete
  // Simplified NodeContextMenu.jsx - no heavy computations
  const renderMoveContextContent = () => (
    <div className="w-full max-w-[280px] min-w-0">
      {" "}
      {/* CSS handles sizing */}
      {!confirmDelete ? (
        <div className="rounded-lg border border-gray-400/80 bg-white dark:bg-gray-800 shadow-xl">
          <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
            Delete move{" "}
            <strong className="break-all">{moveContext.move.san}</strong>?
          </div>
          <div className="flex flex-col gap-2 px-3 py-2 sm:flex-row">
            <button
              onClick={handleShowConfirm}
              className="flex-1 rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-red-500/80 bg-white dark:bg-gray-800 shadow-xl">
          <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-red-50 dark:bg-red-900/20 rounded-t-lg">
            <div className="flex items-center gap-2">
              <span className="font-medium text-red-600">⚠</span>
              <span className="font-medium">Confirm Deletion</span>
            </div>
          </div>
          <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="break-words">
              Delete{" "}
              <strong className="text-red-600">{moveContext.move.san}</strong>?
            </div>
            <div className="text-xs text-gray-500 mt-1">Cannot be undone.</div>
          </div>
          <div className="flex flex-col gap-2 px-3 py-2 sm:flex-row">
            <button
              onClick={handleCancel}
              className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="flex-1 rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 font-medium"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  )

  // If this is a move-specific context menu, use the enhanced content
  if (moveContext) {
    return renderMoveContextContent()
  }

  // Your existing line-level context menu (unchanged)
  return (
    <div className="context-menu absolute flex items-center justify-between h-full w-full pb-[5px] pt-[30px] mt-[5px] border-gray-400/80 bg-indigo-200 dark:bg-indigo-400 rounded-b-xl rounded-r-xl dark:border-gray-500/80 pr-2">
      {node.options.childrenCount != 0 && (
        <div className="flex ml-2">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex h-fit items-center gap-x-1.5 rounded-md border-1 border-indigo-500 bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Icon
                name="Delete"
                className="-ml-0.5 h-5 w-5"
                aria-hidden="true"
              />
              Delete this Line
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleDeleteConfirm}
                className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
              >
                Confirm Delete
              </button>
              <button
                onClick={handleCancel}
                className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
      <div className="flex justify-center w-6">
        <Icon
          name="Cancel"
          className="h-6 w-6 text-gray-600 dark:text-gray-300 z-50 cursor-pointer"
          onClick={handleCancel}
        />
      </div>
    </div>
  )
}

export default NodeContextMenu
