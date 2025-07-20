// providers/MoveStateProvider.jsx
import React, { createContext, useContext } from "react"
import { useMoveStateManager } from "./MoveStateManager"

const MoveStateContext = createContext(null)

export function MoveStateProvider({ children }) {
  const moveStateManager = useMoveStateManager()

  return (
    <MoveStateContext.Provider value={moveStateManager}>
      {children}
    </MoveStateContext.Provider>
  )
}

export function useMoveState() {
  const context = useContext(MoveStateContext)
  if (!context) {
    throw new Error("useMoveState must be used within a MoveStateProvider")
  }
  return context
}
