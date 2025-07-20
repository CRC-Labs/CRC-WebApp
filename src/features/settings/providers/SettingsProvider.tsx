import React from "react"
import { useSmartMoveSetting, useClickBoardResetSetting, useSaveSetting } from "../hooks/useSettings"


// Define the interface for the context object
interface SettingsContextInterface {
  smartMove: boolean // A boolean value indicating whether the smart move setting is enabled
  setSmartMove: Function // A function to set the value of the smart move setting
  clickBoardReset: boolean
  setClickBoardReset: Function
  resetMinRangeWhenUnlock: boolean
  SetResetMinRangeWhenUnlock: Function
  resetBoardWhenMinTrainingRangeChanged: boolean
  SetResetBoardWhenMinTrainingRangeChanged: Function
}

// Create a new context for the application settings
const Context = React.createContext<SettingsContextInterface | null>(null)

/**
 * A React component that provides a context for the application settings.
 *
 * @param children The child components to render within the context provider.
 * @returns A React component that provides a context for the application settings.
 */
export default function SettingsProvider({ children }) {
  // Get the smart move setting and its setter function from the `useSmartMoveSetting` hook
  const [smartMove, setSmartMove] = useSmartMoveSetting()
  const [clickBoardReset, setClickBoardReset] = useClickBoardResetSetting()
  const [resetMinRangeWhenUnlock, SetResetMinRangeWhenUnlock] = useSaveSetting(
    "ResetMinRangeWhenUnlock"
  )
  const [
    resetBoardWhenMinTrainingRangeChanged,
    SetResetBoardWhenMinTrainingRangeChanged,
  ] = useSaveSetting("ResetBoardWhenMinTrainingRangeChanged")

  // Render the child components within the context provider
  return (
    <Context.Provider
      value={{
        smartMove,
        setSmartMove,
        clickBoardReset,
        setClickBoardReset,
        resetMinRangeWhenUnlock,
        SetResetMinRangeWhenUnlock,
        resetBoardWhenMinTrainingRangeChanged,
        SetResetBoardWhenMinTrainingRangeChanged,
      }}
    >
      {children}
    </Context.Provider>
  )
}

/**
 * A custom React hook that returns the `Context` object from the `SettingsProvider` component.
 *
 * @returns The `Context` object from the `SettingsProvider` component.
 */
export function useSettingsProvider() {
  return React.useContext(Context)
}
