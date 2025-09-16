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
import React, { useEffect } from "react"
import { Dispatch, SetStateAction, useState } from "react"

import { useRouter } from "next/router"
import LoadingScreenWithoutLayout from "@/features/common/components/LoadingScreenWithoutLayout"

// Enum for different modules in the application
export enum Modules {
  MainMenu,
  Repertoires,
  Repertoire,
  Trainings,
  SignIn,
  SignUp,
}

const modulesNames = {
  0: "Main Menu",
  1: "Repertoires List",
  2: "Repertoire",
}

// Interface representing the shape of the App Context
interface AppContextInterface {
  module: Modules // Current active module
  setModule: Dispatch<SetStateAction<Modules>> // Function to set the active module
  setRepertoireModule: (rid: string) => void // Function to set the Repertoire module
  isSettingsModalOpen: boolean // Flag to determine if settings modal is open
  setIsSettingsModalOpen: Dispatch<SetStateAction<boolean>> // Function to toggle settings modal
  openings: Map<string, string> // Map containing opening data
  loadingState: { isLoading: boolean; message: string | null }
  setLoadingState: Dispatch<
    SetStateAction<{ isLoading: boolean; message: string | null }>
  >
}

// Create a new context for the App Context Interface
const Context = React.createContext<AppContextInterface | null>(null)

// AppContextProvider component handles routing and provides modal utilities
export default function AppContextProvider({ children, openings }) {
  const [module, _setModule] = useState<Modules>(null) // State to manage active module
  const [loadingState, setLoadingState] = useState<{
    isLoading: boolean
    message: string | null
  }>({ isLoading: true, message: "Loading..." })

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false) // State to manage settings modal visibility
  const router = useRouter() // Next.js router instance

  // Effect to handle route changes and update active module accordingly
  useEffect(() => {
    const url = router.asPath
    const urlParams = new URLSearchParams(url.substring(4, url.length))
    if (urlParams.has("module")) {
      let m = parseInt(urlParams.get("module"))
      _setModule(m)
    } else {
      _setModule(Modules.MainMenu)
    }

    // Clean up effect: unsubscribe from route change event
    return () => {
      //router.events.off("routeChangeComplete", handleRouteChangeComplete)
    }
  }, [router.asPath, router.events])

  // Function to navigate to the Repertoire module with a specific repertoire ID
  function setRepertoireModule(rid) {
    if (rid) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

      if (isMobile) {
        router.push(`/app?module=${Modules.Repertoire}&rid=${rid}`, undefined, {
          shallow: false,
        })
      } else {
        router.push(`/app?module=${Modules.Repertoire}&rid=${rid}`, undefined, {
          shallow: true,
        })
      }
      setLoadingState({ isLoading: true, message: "Loading Repertoire..." })
    }
  }

  // Function to set the active module and handle URL updates
  function setModule(nextModule) {
    if (nextModule !== module) {
      let queryModule = parseInt(String(router.query.module))
      if (queryModule) {
        if (queryModule !== nextModule) {
          router.push("/app?module=" + nextModule, undefined, {
            shallow: true,
          })
        }
      } else {
        router.push("/app?module=" + nextModule, undefined, {
          shallow: true,
        })
      }
      setLoadingState({
        isLoading: true,
        message: "Loading " + modulesNames[nextModule] + "...",
      })
    }
  }

  // Provide the context values to the children components
  return (
    <Context.Provider
      value={{
        module,
        setModule,
        setRepertoireModule,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        openings,
        loadingState,
        setLoadingState,
      }}
    >
      {loadingState.isLoading && (
        <div className="absolute w-screen h-screen z-60">
          <LoadingScreenWithoutLayout
            message={loadingState.message || "Loading..."}
          />
        </div>
      )}
      {children}
    </Context.Provider>
  )
}

// Custom hook to access the AppContextInterface values
export function useAppContext() {
  return React.useContext(Context)
}
