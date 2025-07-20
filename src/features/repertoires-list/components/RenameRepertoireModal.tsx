import { useState } from "react"

import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import * as Yup from "yup"
import { useRepertoireStoreOperations } from "../hooks/useRepertoireStoreOperations"
import Modal from "@/features/modals/components/Modal"
import ModalFooterButtonBar from "@/features/modals/components/ModalFooterButtonBar"

function RenameRepertoireModal({ isOpen, cancelFunc, oldName, repertoireId }) {
  const { isRepertoireNameAlreadyExists, renameRepertoire } =
    useRepertoireStoreOperations()
  const [submitted, setSubmitted] = useState(false)
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("A name is required")
      .test(
        "sameName",
        (d) => `Please change the name or cancel`,
        (value) => {
          return value !== oldName
        },
      )
      .test(
        "nameAlreadyExists",
        (d) => `A repertoire with the name "${d.value}" already exists`,
        (value) => {
          return !isRepertoireNameAlreadyExists(value)
        },
      ),
  })

  // Set the options for the useForm hook
  const formOptions = {
    resolver: yupResolver(validationSchema),
    revalidateMode: "onChange",
  }

  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm(formOptions)

  const hasErrors = Object.entries(errors).length !== 0

  function onSubmit(data) {
    if (!hasErrors) {
      if (!submitted) {
        setSubmitted(true) //Prevent multiple clicks
        //RENAME HERE
        renameRepertoire(repertoireId, data.title)
        cancelFunc()
      }
    }

    // display form data on success
    return false
  }

  return (
    <Modal title="Rename Repertoire" onClose={cancelFunc} isOpen={isOpen}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full flex-col items-center rounded-2xl bg-stone-300 px-4 text-lg dark:bg-stone-900 sm:max-w-[80vw] sm:px-8"
      >
        <section className="mt-4 flex w-full flex-col items-center border-zinc-200 pt-4 dark:border-zinc-800 sm:max-w-[40vw]">
          <header className="self-start text-gray-500 dark:text-gray-400">
            Name
          </header>
          <div className="relative w-full max-w-lg py-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 stroke-indigo-400/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </span>
            <input
              {...register("title")}
              className={(() => {
                const base =
                  "p-2 pl-10 w-full text-sm text-gray-500 dark:text-gray-400 bg-gray-300 dark:bg-gray-700 rounded-md border border-gray-400/50 outline-none shadow-inner"
                let add
                if (errors.title) {
                  add =
                    "focus:ring-2 border-red-600 focus:ring-red-300 dark:focus:ring-red-400"
                } else if (
                  watch("title") &&
                  watch("title") !== "" &&
                  watch("title") !== oldName
                ) {
                  add =
                    "focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-300 border-emerald-300 dark:focus:border-emerald-600"
                }
                return base + " " + add
              })()}
              type="text"
              spellCheck="false"
              id="title"
              name="title"
              defaultValue={oldName}
            />
          </div>
          {errors.title ? (
            <div className="h-7 animate-pulse text-center text-sm text-red-700 dark:text-red-400">
              {errors.title?.message}
            </div>
          ) : (
            <div className="h-7 w-full"></div>
          )}
        </section>
        <input type="submit" hidden />
        <ModalFooterButtonBar
          cancelFunc={cancelFunc}
          onSubmit={() => {}}
          okLabel="Rename"
          cancelLabel={"Cancel"}
        />
      </form>
    </Modal>
  )
}

export default RenameRepertoireModal
