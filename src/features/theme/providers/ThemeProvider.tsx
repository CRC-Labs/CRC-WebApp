import LoadingScreenWithoutLayout from "@/features/common/components/LoadingScreenWithoutLayout"
import React from "react"
import { useEffect, useState } from "react"

// Define the interface for the context object
interface ThemeContextInterface {
  themeMode: String | null // A string value indicating the current theme mode (light, dark, or system)
  setThemeMode: Function // A function to set the value of the theme mode
}

// Create a new context for the theme settings
const Context = React.createContext<ThemeContextInterface | null>(null)

/**
 * A React component that provides a context for the theme settings.
 *
 * @param children The child components to render within the context provider.
 * @returns A React component that provides a context for the theme settings.
 */
export default function ThemeProvider({ children }) {
  // Define the state for the theme mode
  const [themeMode, _setThemeMode] = useState<String | null>(null)

  // Use the `useEffect` hook to set the initial theme mode based on the user's preferences
  useEffect(() => {
    if (!("theme" in localStorage) && themeMode === null) {
      _setThemeMode("system")
    } else if (themeMode === null) {
      if (localStorage.theme === "dark") {
        setThemeMode("dark")
      } else {
        setThemeMode("light")
      }
    }
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  }, [themeMode])

  // Use the `useEffect` hook to update the theme mode based on the user's preferences
  useEffect(() => {
    if (!("theme" in localStorage) || themeMode === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        //System use dark mode
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    } else {
      if (localStorage.theme === "dark" || themeMode === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  }, [themeMode])

  // Define the function to set the theme mode
  function setThemeMode(value) {
    if (value === "system") {
      // Whenever the user explicitly chooses to respect the OS preference
      localStorage.removeItem("theme")
    } else {
      localStorage.theme = value
    }
    _setThemeMode(value)
  }

  // Render the child components within the context provider
  return (
    <>
      {themeMode === null ? (
        <LoadingScreenWithoutLayout message="Loading Theme Manager..." />
      ) : (
        <Context.Provider value={{ themeMode, setThemeMode }}>
          {children}
        </Context.Provider>
      )}
    </>
  )
}

/**
 * A custom React hook that returns the `Context` object from the `ThemeProvider` component.
 *
 * @returns The `Context` object from the `ThemeProvider` component.
 */
export function useThemeProvider() {
  return React.useContext(Context)
}
