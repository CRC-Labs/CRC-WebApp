/**
 * @file AppContextProvider.tsx
 * @description This file defines the AppContextProvider component, which manages the application context.
 * The context includes information about the active module, handles routing, and provides utilities
 * related to modals and user interactions. It utilizes React context to provide these functionalities
 * to the child components. Additionally, it exports the 'Modules' enum and a custom hook 'useAppContext'
 * to conveniently access the context values in other parts of the application.
 *
 * @summary Context Management for Application Modules and Routing.
 *
 * @remarks This component utilizes React context API to manage the state of active modules, handle
 * route changes, and provide utility functions for modals and user interactions. It allows the child
 * components to access the current module, update the active module, manage modals, and perform actions
 * related to routing and modules.
 *
 * @see {@link https://reactjs.org/docs/context.html} for more information about React Context API.
 * @see {@link https://nextjs.org/docs/routing/introduction} for Next.js routing documentation.
 *
 * @exports AppContextProvider - The context provider component.
 * @exports useAppContext - A custom hook to access the context values.
 * @exports Modules - Enum representing different modules in the application.
 *
 * @version 0.2.1
 * @date April 30, 2023
 * @author [Jérémy Guillemot]
 */
import React, { useEffect, useState } from "react"

interface AuthenticationStateProviderInterface {
  authenticationState: AuthenticationStateInterface
  setAuthenticationState: React.Dispatch<
    React.SetStateAction<AuthenticationStateInterface>
  >
}

const Context =
  React.createContext<AuthenticationStateProviderInterface | null>(null)

// Add isInitializing to your state interface
interface AuthenticationStateInterface {
  isAuthenticated: boolean
  authToken: string
  isInitializing: boolean // New property
}

export default function AuthenticationStateProvider({ children }) {
  const [authenticationState, _setAuthenticationState] = useState({
    isAuthenticated: false,
    authToken: "",
    isInitializing: true, // Start as true
  })

  function setAuthenticationState(authState) {
    // Add isInitializing: false to the new state
    const newState = { ...authState, isInitializing: false }

    // Only update localStorage and state if there's an actual change
    if (authState.authToken !== authenticationState.authToken) {
      if (authState.authToken !== "") {
        localStorage.setItem("authToken", authState.authToken)
      } else {
        localStorage.removeItem("authToken")
      }
      _setAuthenticationState(newState)
    } else if (authenticationState.isInitializing) {
      // If only initializing state is changing, still update
      _setAuthenticationState(newState)
    }
  }

  useEffect(() => {
    let storedToken = localStorage.getItem("authToken")
    if (storedToken !== null && storedToken !== "") {
      if (authenticationState.authToken !== storedToken) {
        _setAuthenticationState({
          isAuthenticated: false,
          authToken: storedToken,
          isInitializing: true, // Still initializing
        })
      }
    } else {
      // No token, finish initialization immediately
      _setAuthenticationState({
        isAuthenticated: false,
        authToken: "",
        isInitializing: false,
      })
    }
  }, [])

  return (
    <Context.Provider
      value={{
        authenticationState,
        setAuthenticationState,
      }}
    >
      {children}
    </Context.Provider>
  )
}

// Custom hook to access the AppContextInterface values
export function useAuthenticationState() {
  return React.useContext(Context)
}
