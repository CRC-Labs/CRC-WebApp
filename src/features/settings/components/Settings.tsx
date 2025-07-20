import React from "react"

import { useSettingsProvider } from "@/features/settings/providers/SettingsProvider"
import SwitchThemeBar from "@/features/theme/components/SwitchThemeBar"

/**
 * A React component that displays the settings menu.
 *
 * @returns A React component that displays the settings menu.
 */
export default function Settings() {
  // Get the `smartMove` setting and its setter function from the `useSettingsProvider` hook
  const {
    smartMove,
    setSmartMove,
    clickBoardReset,
    setClickBoardReset,
    resetMinRangeWhenUnlock,
    SetResetMinRangeWhenUnlock,
    resetBoardWhenMinTrainingRangeChanged,
    SetResetBoardWhenMinTrainingRangeChanged,
  } = useSettingsProvider()

  // Render the settings menu UI using JSX
  return (
    <section className="flex w-full flex-col px-4">
      <section className="flex flex-col">
        {/* Theme section */}
        <div className="p-6">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-slate-700 dark:text-slate-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.4}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            <div className="ml-4 text-lg font-semibold leading-7 text-slate-700 dark:text-slate-300">
              <p>Theme</p>
            </div>
          </div>
          <SwitchThemeBar />
        </div>

        {/* Smart One-Click Move-Input section */}
        <div className="p-6">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8 text-slate-700 dark:text-slate-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
              />
            </svg>

            <div className="ml-4 text-lg font-semibold leading-7 text-slate-700 dark:text-slate-300">
              <p>Smart One-Click Move-Input</p>
            </div>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Enabling this option allows direct clicking on squares for move
            placement during training. Dragging and dropping pieces is disabled
            in this mode. (If attempted, the square of the dragged piece is
            mistakenly interpreted as the target square, potentially leading to
            incorrect moves.) The program does not care if more than one piece
            can move to the same target square and you had a different one in
            mind when you clicked. In order to simplify the process you will see
            the move the program was expecting anyway.
          </p>
          {/* Render the smart move toggle button */}
          <div
            className="mt-4 flex flex-row items-center justify-center select-none"
            onClick={() => {
              setSmartMove(!smartMove)
            }}
          >
            {smartMove ? (
              <div className="flex w-[100px] cursor-pointer items-center justify-center rounded-full border-2 border-gray-200 bg-lime-600/50 text-gray-200 shadow-inner transition-all duration-1000">
                <p className="p-2">Enabled</p>
              </div>
            ) : (
              <div className="flex w-[100px] cursor-pointer items-center justify-center rounded-full border-2 border-gray-200  bg-red-600/50 text-gray-200 transition-all duration-1000 dark:text-gray-400/80">
                <p className="p-2">Disabled</p>
              </div>
            )}
          </div>
        </div>

        {/* Click Board Reset section */}
        <div className="p-6">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8 text-slate-700 dark:text-slate-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
              />
            </svg>

            <div className="ml-4 text-lg font-semibold leading-7 text-slate-700 dark:text-slate-300">
              <p>Click on Board Reset</p>
            </div>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Enabling this option will allow to click on the board at the end of
            a line during training to reset the board instead of having to click
            on the reset button.
          </p>
          {/* Render the cobr toggle button */}
          <div
            className="mt-4 flex flex-row items-center justify-center select-none"
            onClick={() => {
              setClickBoardReset(!clickBoardReset)
            }}
          >
            {clickBoardReset ? (
              <div className="flex w-[100px] cursor-pointer items-center justify-center rounded-full border-2 border-gray-200 bg-lime-600/50 text-gray-200 shadow-inner transition-all duration-1000">
                <p className="p-2">Enabled</p>
              </div>
            ) : (
              <div className="flex w-[100px] cursor-pointer items-center justify-center rounded-full border-2 border-gray-200  bg-red-600/50 text-gray-200 transition-all duration-1000 dark:text-gray-400/80">
                <p className="p-2">Disabled</p>
              </div>
            )}
          </div>
        </div>

        {/* Reset Min Training Range section */}
        <div className="p-6">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8 text-slate-700 dark:text-slate-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>

            <div className="ml-4 text-lg font-semibold leading-7 text-slate-700 dark:text-slate-300">
              <p>Reset Min Training Range On Unlock</p>
            </div>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            When enabled, unlocking a locked position will automatically adjust
            the minimum training range to 1. This ensures a seamless experience
            by simplifying the process of setting the minimum training range
            after unlocking a position.
          </p>
          {/* Render the cobr toggle button */}
          <div
            className="mt-4 flex flex-row items-center justify-center select-none"
            onClick={() => {
              SetResetMinRangeWhenUnlock(!resetMinRangeWhenUnlock)
            }}
          >
            {resetMinRangeWhenUnlock ? (
              <div className="flex w-[100px] cursor-pointer items-center justify-center rounded-full border-2 border-gray-200 bg-lime-600/50 text-gray-200 shadow-inner transition-all duration-1000">
                <p className="p-2">Enabled</p>
              </div>
            ) : (
              <div className="flex w-[100px] cursor-pointer items-center justify-center rounded-full border-2 border-gray-200  bg-red-600/50 text-gray-200 transition-all duration-1000 dark:text-gray-400/80">
                <p className="p-2">Disabled</p>
              </div>
            )}
          </div>
        </div>

        {/* Reset Board When Min Training Range Changed section */}
        <div className="p-6">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-8 w-8 text-slate-700 dark:text-slate-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M27,8H6.83l3.58-3.59L9,3,3,9l6,6,1.41-1.41L6.83,10H27V26H7V19H5v7a2,2,0,0,0,2,2H27a2,2,0,0,0,2-2V10A2,2,0,0,0,27,8Z"
              />
            </svg>

            <div className="ml-4 text-lg font-semibold leading-7 text-slate-700 dark:text-slate-300">
              <p>Reset Board On Min Training Range Change</p>
            </div>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300">
            Enable this option to automatically reset the board whenever the
            minimum training range boundary is adjusted. This feature
            specifically comes into play when the new minimum training range is
            less than the current turn on the board. In all other situations,
            the board will reset regardless, ensuring a seamless and intuitive
            training experience.
          </p>
          {/* Render the cobr toggle button */}
          <div
            className="mt-4 flex flex-row items-center justify-center select-none"
            onClick={() => {
              SetResetBoardWhenMinTrainingRangeChanged(
                !resetBoardWhenMinTrainingRangeChanged,
              )
            }}
          >
            {resetBoardWhenMinTrainingRangeChanged ? (
              <div className="flex w-[100px] cursor-pointer items-center justify-center rounded-full border-2 border-gray-200 bg-lime-600/50 text-gray-200 shadow-inner transition-all duration-1000">
                <p className="p-2">Enabled</p>
              </div>
            ) : (
              <div className="flex w-[100px] cursor-pointer items-center justify-center rounded-full border-2 border-gray-200  bg-red-600/50 text-gray-200 transition-all duration-1000 dark:text-gray-400/80">
                <p className="p-2">Disabled</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  )
}
