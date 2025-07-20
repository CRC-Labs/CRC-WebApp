import React, { useEffect, useRef, useState } from "react"

import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { Store } from "react-notifications-component"

import {
  Modules,
  useAppContext,
} from "@/features/context/providers/AppContextProvider"
import { useChessProvider } from "@/features/chess/logic/providers/ChessProvider"
import { useRepertoireProvider } from "@/features/repertoire/providers/RepertoireProvider"

import LoadingScreenWithoutLayout from "@/features/common/components/LoadingScreenWithoutLayout"
import { getWidthAndHeight } from "@/features/common/utils/helpers"
import { RepertoireMode } from "../../../types/Repertoire"
import { useRepertoireLinesLogic } from "../hooks/useRepertoireLinesLogic"
import { useAuthenticationState } from "@/features/auth/providers/AuthenticationStateProvider"
import { useRepertoireStoreOperations } from "@/features/repertoires-list/hooks/useRepertoireStoreOperations"
import { useBoardProvider } from "@/features/chess/board/providers/BoardProvider"

// Dynamically import the `RepertoireBuilder` component
const BuildModeContainer = dynamic(
  () => import("@/features/repertoire/components/BuildModeContainer"),
  {
    ssr: false,
  },
)

// Dynamically import the `RepertoireTrainer` component
const RepertoireTrainer = dynamic(
  () => import("@/features/repertoire/components/RepertoireTrainer"),
  {
    ssr: false,
  },
)

/**
 * A React component that displays the repertoire builder or trainer based on the current mode.
 *
 * @returns A React component that displays the repertoire builder or trainer based on the current mode.
 */
export default function Repertoire() {
  // Get the current repertoire, repertoire loading function, and repertoire mode from the `useRepertoireManager` hook
  const { repertoire, mode } = useRepertoireProvider()
  const prevMode = useRef(mode)
  const { updateBoard } = useBoardProvider()
  const { loadRepertoire } = useRepertoireStoreOperations()
  const { computeLines } = useRepertoireLinesLogic()
  const { loadingState, setLoadingState } = useAppContext()

  // Get the chess instance from the `useChessProvider` hook
  const { chess } = useChessProvider()

  // Get the current module and module setter from the `useAppContext` hook
  const { setModule } = useAppContext()

  // Define the state variables for loading and layout
  const [flexDirection, setFlexDirection] = useState(
    window.innerWidth >= window.innerHeight
      ? "flex-row justify-center"
      : "flex-col items-center",
  )
  const [width, setWidth] = useState(getWidthAndHeight()[0])
  const [height, setHeight] = useState(getWidthAndHeight()[1])

  // Get the router instance from the `useRouter` hook
  const router = useRouter()
  const { authenticationState } = useAuthenticationState()

  useEffect(() => {
    if (prevMode.current !== mode && prevMode.current !== null) {
      setTimeout(() => {
        if (updateBoard) {
          updateBoard()
        }
      }, 100)
    }
    prevMode.current = mode
  }, [mode, updateBoard])

  useEffect(() => {
    window.addEventListener("resize", updateFlexDirection)
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener("change", updateFlexDirection)
    }
    return () => {
      window.removeEventListener("resize", updateFlexDirection)
      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener(
          "change",
          updateFlexDirection,
        )
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener("resize", updateFlexDirection)
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener("change", updateFlexDirection)
    }
    return () => {
      window.removeEventListener("resize", updateFlexDirection)
      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener(
          "change",
          updateFlexDirection,
        )
      }
    }
  }, [])

  useEffect(() => {
    if (
      loadingState.isLoading &&
      (repertoire.current === null ||
        repertoire.current.id !== router.query.rid)
    ) {
      //Ask to rep provider to load repertoire and return loading
      loadRepertoire(router.query.rid as string)
        .then(() => {
          chess.reset()
          computeLines()
          updateBoard()
          setLoadingState({ isLoading: false, message: "Loaded Repertoire" })
        })
        .catch((e) => {
          if (e.message) {
            Store.addNotification({
              title: "An error occured",
              message: e.message,
              type: "danger",
              insert: "bottom",
              container: "bottom-center",
              animationIn: ["animate__animated", "animate__fadeIn"],
              animationOut: ["animate__animated", "animate__fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: true,
              },
            })
          }
          setModule(Modules.MainMenu)
        })
    } else if (loadingState.isLoading) {
      setLoadingState({ isLoading: false, message: "Loaded Repertoire" })
    }
  }, [chess, loadRepertoire, repertoire, router.query.rid, setModule])

  useEffect(() => {
    // If the user is not authenticated and there is a current repertoire that is not a demo repertoire, reset the current repertoire and switch to the `Repertoires` module
    if (
      !authenticationState.isAuthenticated &&
      repertoire.current &&
      !repertoire.current.state.demo
    ) {
      repertoire.current = null
      setModule(Modules.Repertoires)
    } else if (!repertoire.current) {
      // If there is no current repertoire, switch to the `Repertoires` module
      setModule(Modules.Repertoires)
    }

    // Disable the exhaustive-deps lint rule for this `useEffect` hook because it depends on the `repertoire` and `setModule` states, which are not included in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticationState.isAuthenticated])

  // Define the function to display the repertoire builder or trainer based on the current mode
  function displayModule() {
    if (!mode || mode === RepertoireMode.BUILD) {
      return <BuildModeContainer width={width} height={height} />
    } else if (mode === RepertoireMode.TRAIN) {
      return <RepertoireTrainer width={width} height={height} />
    }
  }

  // Define the function to update the layout on resize or orientation change
  function updateFlexDirection() {
    setFlexDirection(
      window.innerWidth >= window.innerHeight
        ? "flex-row justify-center"
        : "flex-col items-center",
    )
    let widthAndHeigth = getWidthAndHeight()
    setWidth(widthAndHeigth[0])
    setHeight(widthAndHeigth[1])
  }

  return (
    <main
      className={
        flexDirection +
        " flex w-screen h-screen bg-stone-300 dark:bg-stone-900 overflow-hidden"
      }
    >
      {loadingState.isLoading ? (
        <LoadingScreenWithoutLayout message="Loading Repertoire..." />
      ) : (
        displayModule()
      )}
    </main>
  )
}
