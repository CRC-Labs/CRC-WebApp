import React, { useEffect, useState } from "react"

import Footer from "@/features/common/components/Footer"

import { useAppContext } from "@/features/context/providers/AppContextProvider"
import RepertoireCard from "@/features/repertoires-list/components/RepertoireCard"
import RepertoireCreation from "@/features/repertoires-list/components/RepertoireCreation"
import Layout from "@/features/common/components/Layout"
import { Icon } from "@/features/common/utils/icons"
import { useModals } from "@/features/modals/hooks/useModals"
import { useRepertoireStoreOperations } from "../hooks/useRepertoireStoreOperations"
import { useRepertoireStoreProvider } from "../providers/RepertoireStoreProvider"

// Define an enum for the color filter values
export enum ColorFilterValues {
  Any,
  White,
  Black,
}

/**
 * A React component that displays a list of repertoires and allows the user to create new repertoires and filter the list by color and title.
 *
 * @returns A React component that displays a list of repertoires and allows the user to create new repertoires and filter the list by color and title.
 */
export default function RepertoiresList() {
  // Get the repertoires from the `useRepertoireManager` hook
  const { repertoires, isLoadingRepertoiresList } = useRepertoireStoreProvider()
  const { createNewRepertoire } = useRepertoireStoreOperations()
  const { loadingState, setLoadingState } = useAppContext()

  // Define state variables for the modal and filter UI
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { closeModal, setModalState } = useModals()

  // Get the current module and module setter from the `useAppContext` hook
  const { setModule } = useAppContext()

  // Define state variables for the color and title filters
  const [colorFilterValue, setColorFilterValue] = useState<ColorFilterValues>(
    ColorFilterValues.Any,
  )
  const [titleFilterValue, setTitleFilterValue] = useState<string>("")

  // Define state variables for the filtered repertoires and the FTUE (First Time User Experience) flag
  const [filteredRepertoires, setFilteredRepertoires] = useState(
    isLoadingRepertoiresList ? new Array() : Array.from(repertoires.values()),
  )
  const [ftue, setFtue] = useState(
    isLoadingRepertoiresList ? false : repertoires.size === 0,
  )

  // Update the filtered repertoires whenever the repertoires, color filter, or title filter change
  useEffect(() => {
    if (isLoadingRepertoiresList) {
      return
    }
    setFilteredRepertoires(
      Array.from(repertoires.values()).filter((v) => {
        if (
          colorFilterValue !== ColorFilterValues.Any &&
          ((v.color === "w" && colorFilterValue === ColorFilterValues.Black) ||
            (v.color === "b" && colorFilterValue === ColorFilterValues.White))
        ) {
          return false
        }
        if (titleFilterValue) {
          let words = v.title.toLowerCase().split(" ")

          for (const word of words) {
            if (word.startsWith(titleFilterValue.toLowerCase())) {
              return true
            }
          }
          return false
        }
        return true
      }),
    )

    // Set the FTUE flag if there are no repertoires
    if (repertoires.size === 0) {
      setFtue(true)
    } else {
      setFtue(false)
    }
  }, [
    isLoadingRepertoiresList,
    repertoires,
    colorFilterValue,
    titleFilterValue,
  ])

  useEffect(() => {
    if (loadingState.isLoading) {
      setLoadingState({ isLoading: false, message: "Loaded Repertoires" })
    }
  }, [])

  // Define the color filter UI
  const colorFilter = (
    <div className="flex items-center">
      <p className="px-1">Color :</p>
      <label className="flex items-center rounded-lg border-x border-t border-indigo-400/50 bg-zinc-200 px-2 py-1 shadow-inner dark:bg-zinc-900">
        {(() => {
          switch (colorFilterValue) {
            case ColorFilterValues.Any:
              return (
                <div className="flex h-4 w-4 overflow-hidden rounded-full border border-gray-400">
                  <div className="h-4 w-1/2 bg-white"></div>
                  <div className="h-4 w-1/2 bg-black"></div>
                </div>
              )
            case ColorFilterValues.White:
              return (
                <div className="h-4 w-4 rounded-full border border-gray-400 bg-white" />
              )
            case ColorFilterValues.Black:
              return (
                <div className="h-4 w-4 rounded-full border border-gray-400 bg-gray-900" />
              )
          }
        })()}
        <select
          className="w-fit bg-zinc-200 focus:outline-none dark:bg-zinc-900"
          value={colorFilterValue}
          onChange={(e) => {
            setColorFilterValue(parseInt(e.target.value))
          }}
        >
          <option value={ColorFilterValues.Any}>Any</option>
          <option value={ColorFilterValues.White}>White</option>
          <option value={ColorFilterValues.Black}>Black</option>
        </select>
      </label>
    </div>
  )

  function toggleFilters() {
    setIsFilterOpen(!isFilterOpen)
  }

  // Define the FTUE message
  let bounceCreate = ""
  if (ftue) {
    bounceCreate = "animate-pulse "
  }

  // Render the component
  return (
    <Layout
      logo={true}
      onClick={() => {
        setModule(0)
      }}
    >
      <section className="mb-8 flex w-full flex-col px-2 xs:px-4 sm:w-[85vw]">
        <header className="flex w-full items-center justify-between border-b border-indigo-400/50 pb-2">
          <div className="flex w-fit items-center px-2 text-lg font-bold text-indigo-400">
            <Icon strokeOpacity="0.5" viewBox="0 0 24 24" name="Repertoires" />
            <p className="px-2 font-bold md:text-lg">Repertoires</p>
          </div>
          <div
            className={
              "cursor-pointer px-2 text-indigo-400 transition-all duration-200 hover:text-indigo-500/90"
            }
            onClick={() => {
              setModalState({
                isOpen: true,
                content: (
                  <RepertoireCreation
                    cancelFunc={() => {
                      closeModal()
                    }}
                    createNewRepertoire={createNewRepertoire}
                  />
                ),
                title: "New Repertoire",
              })
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={bounceCreate + "w-10 h-10"}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </header>
        <div className="flex px-2 pt-4 text-indigo-400">
          <div className="relative flex w-full">
            <section className="absolute left-0 max-w-lg">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-indigo-400/60"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                className="w-full rounded-md border border-gray-400/50 bg-gray-300 pl-10 pr-4 text-gray-500 shadow-inner outline-none dark:bg-gray-700 dark:text-gray-400"
                type="text"
                placeholder="Search"
                onChange={(e) => {
                  setTitleFilterValue(e.target.value)
                }}
              />
            </section>
          </div>
          <section
            onClick={toggleFilters}
            className={`${
              isFilterOpen ? "pb-2 shadow-inner " : "rounded-lg shadow-sm "
            }ml-2 flex cursor-pointer items-center gap-2 rounded-t border-x border-t border-zinc-400/50 bg-stone-300 px-2 text-gray-400 transition-all duration-300 ease-in-out dark:border-zinc-600 dark:bg-stone-800/50 dark:text-gray-500`}
          >
            <Icon name="Filter" className="h-4 w-4" />
            <p className="select-none">Filter</p>
          </section>
        </div>
        <div className="relative">
          {isFilterOpen ? (
            <div className="mx-2 rounded-b rounded-l border border-zinc-400/50 bg-stone-300 p-4 text-gray-500 shadow-inner transition-all duration-300 ease-in-out dark:border-zinc-600 dark:bg-stone-800/50 dark:text-gray-400">
              {colorFilter}
            </div>
          ) : (
            <div className="absolute -top-3 right-[70px] h-0 w-0 transition-all duration-300 ease-in-out"></div>
          )}
        </div>

        <div className="flex flex-col gap-4 py-4">
          {ftue ? (
            <div
              className="mb-4 rounded-lg border border-zinc-400/50 bg-zinc-200 px-6 py-5 text-base text-gray-500 shadow-inner dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-400"
              role="alert"
            >
              <h4 className="mb-2 text-2xl font-medium leading-tight text-gray-600 dark:text-gray-200">
                Welcome to your repertoire list !
              </h4>

              <p className="mb-4">
                It seems you don't have any repertoire yet, let's create a new
                one using the button provided for this purpose !
              </p>
              <hr className="border-gray-300 dark:border-gray-400" />
              <p className="mb-0 mt-4">
                Whenever you need, you can always click on the top logo to
                return to the main menu.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredRepertoires.map((v, i) => (
                <RepertoireCard key={i} repertoire={v} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </Layout>
  )
}
