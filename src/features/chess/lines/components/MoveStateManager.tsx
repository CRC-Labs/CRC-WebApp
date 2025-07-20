// hooks/useMoveStateManager.js
import { useState, useCallback } from "react"
import { useChessProvider } from "../../logic/providers/ChessProvider"

export const MOVE_STATES = {
  NORMAL: "normal",
  SELECTED: "selected",
  HIGHLIGHTED: "highlighted", // For search
  PENDING_DELETE: "pending_delete", // For both delete selection AND confirmation
  CURRENT_POSITION: "current_position",
}

export function useMoveStateManager() {
  const { chess } = useChessProvider()
  const [searchHighlight, setSearchHighlight] = useState("")
  const [currentPosition, setCurrentPosition] = useState(null)
  const [pendingDeleteMove, setPendingDeleteMove] = useState(null)

  // Set a move as pending deletion (highlighted in red) - for BOTH delete and confirmation
  const setPendingDelete = useCallback((lineId, moveIndex, move) => {
    setPendingDeleteMove({ lineId, moveIndex, move })
  }, [])

  // Clear pending delete state
  const clearPendingDelete = useCallback(() => {
    setPendingDeleteMove(null)
  }, [])

  // Set search highlight
  const setSearchHighlightText = useCallback((text) => {
    setSearchHighlight(text)
  }, [])

  // Set current position
  const setCurrentPositionState = useCallback((linePgn, moveIndex) => {
    setCurrentPosition({ linePgn, moveIndex })
  }, [])

  // Get the state for a specific move
  const getMoveState = useCallback(
    (lineId, moveIndex, move) => {
      // Priority order: pending delete > current position > search highlight > normal

      // Check if this move is pending deletion (both delete selection AND confirmation)
      if (
        pendingDeleteMove &&
        pendingDeleteMove.lineId === lineId &&
        pendingDeleteMove.moveIndex === moveIndex
      ) {
        return MOVE_STATES.PENDING_DELETE
      }

      // Check if this is the current position
      if (
        currentPosition &&
        currentPosition.linePgn === lineId &&
        currentPosition.moveIndex === moveIndex
      ) {
        if (chess.pgn() === "") {
          setCurrentPosition(null)
        }
        return MOVE_STATES.CURRENT_POSITION
      }

      // Check if this move matches search highlight
      if (
        searchHighlight &&
        move.san.toLowerCase().startsWith(searchHighlight.toLowerCase())
      ) {
        return MOVE_STATES.HIGHLIGHTED
      }

      return MOVE_STATES.NORMAL
    },
    [pendingDeleteMove, currentPosition, searchHighlight],
  )

  // Get CSS classes for a move based on its state
  const getMoveClasses = useCallback((state, baseClasses = "") => {
    const stateClasses = {
      [MOVE_STATES.NORMAL]: "",
      [MOVE_STATES.SELECTED]:
        "border-lime-500 dark:border-lime-500 text-lime-500 dark:text-lime-500",
      [MOVE_STATES.HIGHLIGHTED]: "animate-bounce",
      [MOVE_STATES.PENDING_DELETE]:
        "border-red-500 dark:border-red-500 border-2 animate-bounce", // Only border + animation
      [MOVE_STATES.CURRENT_POSITION]:
        "border-lime-500 dark:border-lime-400 text-lime-500 dark:text-lime-600",
    }

    return `${baseClasses} ${stateClasses[state] || ""}`
  }, [])

  return {
    // State setters
    setPendingDelete,
    clearPendingDelete,
    setSearchHighlightText,
    setCurrentPositionState,

    // State getters
    getMoveState,
    getMoveClasses,

    // Current states
    pendingDeleteMove,
    searchHighlight,
    currentPosition,
  }
}
