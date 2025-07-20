import { useEffect, useState } from "react"

import dynamic from "next/dynamic"

import SignIn from "@/features/auth/components/SignIn"
import {
  Modules,
  useAppContext,
} from "@/features/context/providers/AppContextProvider"
import SettingsProvider from "@/features/settings/providers/SettingsProvider"

import MainMenu from "../../menu/components/MainMenu"
import Settings from "../../settings/components/Settings"
import SignUp from "../../auth/components/SignUp"
import { ModalProvider } from "@/features/modals/providers/ModalProvider"
import { getWindowWidthAndHeight } from "@/features/common/utils/helpers"
import { Icon } from "@/features/common/utils/icons"
import Modal from "@/features/modals/components/Modal"
import RepertoireStoreProvider from "@/features/repertoires-list/providers/RepertoireStoreProvider"
import PromotionModalProvider from "@/features/chess/board/providers/PromotionModalProvider"
import BoardProvider from "@/features/chess/board/providers/BoardProvider"

// Dynamically import the `ChessProvider` component
const ChessProvider = dynamic(
  () => import("@/features/chess/logic/providers/ChessProvider"),
  {
    ssr: false,
  },
)

// Dynamically import the `RepertoireProvider` component
const RepertoireProvider = dynamic(
  () => import("@/features/repertoire/providers/RepertoireProvider"),
  {
    ssr: false,
  },
)

// Dynamically import the `Repertoire` component
const Repertoire = dynamic(
  () => import("../../repertoire/components/Repertoire"),
  {
    ssr: false,
  },
)

// Dynamically import the `Repertoires` component
const Repertoires = dynamic(
  () => import("../../repertoires-list/components/RepertoiresList"),
  {
    ssr: false,
  },
)

/**
 * The main React component for the application.
 *
 * @returns The main React component for the application.
 */
export default function Main() {
  // Get the current module, settings modal state, and settings modal state setter from the app context
  const { module, isSettingsModalOpen, setIsSettingsModalOpen, loadingState } =
    useAppContext()

  // Get the window width, height, and orientation using the `getWindowWidthAndHeight` helper function
  let [_width, _height, _orientation] = getWindowWidthAndHeight()
  const [width, setWidth] = useState(_width)
  const [height, setHeight] = useState(_height)
  const [orientation, setOrientation] = useState(_orientation)

  // Use the `useEffect` hook to update the window dimensions and orientation on resize or orientation change
  useEffect(() => {
    window.addEventListener("resize", updateStateonResize)
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener("change", updateStateonResize)
    }
    return () => {
      window.removeEventListener("resize", updateStateonResize)
      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener(
          "change",
          updateStateonResize,
        )
      }
    }
  }, [])

  // Define the function to update the window dimensions and orientation on resize or orientation change
  function updateStateonResize() {
    let [_width, _height, _orientation] = getWindowWidthAndHeight()
    setWidth(_width)
    setHeight(_height)
    setOrientation(_orientation)
  }

  // Determine which module to display based on the current module state
  let moduleToDisplay
  switch (module) {
    case Modules.MainMenu:
      moduleToDisplay = <MainMenu />
      break
    case Modules.Repertoires:
      moduleToDisplay = (
        <PromotionModalProvider>
          <BoardProvider>
            <RepertoireStoreProvider>
              <RepertoireProvider>
                <Repertoires />
              </RepertoireProvider>
            </RepertoireStoreProvider>
          </BoardProvider>
        </PromotionModalProvider>
      )
      break
    case Modules.Repertoire:
      moduleToDisplay = (
        <PromotionModalProvider>
          <BoardProvider>
            <RepertoireStoreProvider>
              <RepertoireProvider>
                <Repertoire />
              </RepertoireProvider>
            </RepertoireStoreProvider>
          </BoardProvider>
        </PromotionModalProvider>
      )
      break
    case Modules.Trainings:
      moduleToDisplay = <MainMenu />
      break
    case Modules.SignIn:
      moduleToDisplay = <SignIn />
      break
    case Modules.SignUp:
      moduleToDisplay = <SignUp />
      break
    default:
      moduleToDisplay = <MainMenu />
      break
  }

  // Render the child components within the context providers
  return (
    <ChessProvider>
      <ModalProvider>
        <SettingsProvider>
          {isSettingsModalOpen ? (
            <Modal
              title={
                <div className="flex w-fit items-center text-lg font-bold text-indigo-400">
                  <Icon
                    strokeOpacity="0.5"
                    viewBox="0 0 24 24"
                    name="Settings"
                  />
                  <p className="font-bold md:text-lg">Settings</p>
                </div>
              }
              isOpen={isSettingsModalOpen}
              onClose={() => {
                setIsSettingsModalOpen(false)
              }}
            >
              <Settings />
            </Modal>
          ) : (
            <></>
          )}
          {moduleToDisplay}
        </SettingsProvider>
      </ModalProvider>
    </ChessProvider>
  )
}
