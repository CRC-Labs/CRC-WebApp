import { useState, useEffect } from "react"

/**
 * Custom hook for the smart move setting.
 * The `useSmartMoveSetting` function is a custom hook that retrieves the smart move setting from local storage and returns it as a boolean value.
 * The function first checks if the smart move setting is stored in local storage and sets the `tmpVal` variable accordingly.
 * If the smart move setting is not stored in local storage, the function sets the `tmpVal` variable to `false`.
 * The function then creates a state variable `value` with the `tmpVal` value and a `setValue` function to update the state.
 * The function uses the `useEffect` hook to update the smart move setting in local storage whenever the `value` state changes.
 * The function returns the `value` state and the `setValue` function as a tuple.
 * @returns A tuple containing the smart move setting value and the `setValue` function.
 */
export function useSmartMoveSetting() {
  const stored = localStorage.getItem("SmartMove")
  let tmpVal
  if (stored === "true") {
    tmpVal = true
  } else {
    tmpVal = false
  }
  const [value, setValue] = useState(tmpVal)
  useEffect(() => {
    localStorage.setItem("SmartMove", JSON.stringify(value))
  }, [value])

  return [value, setValue] as const
}

export function useSaveSetting(settingKey) {
  const stored = localStorage.getItem(settingKey)
  let tmpVal
  if (stored === "true") {
    tmpVal = true
  } else {
    tmpVal = false
  }
  const [value, setValue] = useState(tmpVal)
  useEffect(() => {
    localStorage.setItem(settingKey, JSON.stringify(value))
  }, [settingKey, value])

  return [value, setValue] as const
}

/**
 * Custom hook for the smart move setting.
 * The `useSmartMoveSetting` function is a custom hook that retrieves the smart move setting from local storage and returns it as a boolean value.
 * The function first checks if the smart move setting is stored in local storage and sets the `tmpVal` variable accordingly.
 * If the smart move setting is not stored in local storage, the function sets the `tmpVal` variable to `false`.
 * The function then creates a state variable `value` with the `tmpVal` value and a `setValue` function to update the state.
 * The function uses the `useEffect` hook to update the smart move setting in local storage whenever the `value` state changes.
 * The function returns the `value` state and the `setValue` function as a tuple.
 * @returns A tuple containing the smart move setting value and the `setValue` function.
 */
export function useClickBoardResetSetting() {
  const stored = localStorage.getItem("ClickBoardReset")
  let tmpVal
  if (stored === "true") {
    tmpVal = true
  } else {
    tmpVal = false
  }
  const [value, setValue] = useState(tmpVal)
  useEffect(() => {
    localStorage.setItem("ClickBoardReset", JSON.stringify(value))
  }, [value])

  return [value, setValue] as const
}