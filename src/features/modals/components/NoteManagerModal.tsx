import { useEffect } from "react"

import { Dialog } from "@headlessui/react"

let init = false
export default function NoteManagerModal({
  children,
  isOpen,
  closeModal,
  title,
}) {
  function onClose(e) {
    closeModal(true)
  }

  useEffect(() => {
    if (init === false) {
      const tx = document.getElementsByTagName("textarea")
      for (let i = 0; i < tx.length; i++) {
        tx[i].setAttribute(
          "style",
          "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
        )

        tx[i].addEventListener("input", OnInput, false)
      }
      init = true
    }
    function OnInput() {
      this.style.height = 0
      this.style.height = this.scrollHeight + "px"
    }

    return () => {
      if (init) {
        const tx = document.getElementsByTagName("textarea")
        for (let i = 0; i < tx.length; i++) {
          tx[i].setAttribute(
            "style",
            "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
          )
          tx[i].removeEventListener("input", OnInput)
        }
        init = false
      }
    }
  })

  return (
    <>
      <Dialog
        as="div"
        className="fixed inset-0 z-30 h-screen overflow-hidden"
        onClose={onClose}
        open={isOpen}
      >
        <div className="relative z-50 min-h-screen text-center">
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="relative inline-block w-full rounded-2xl border border-zinc-400/50 bg-stone-300 text-left align-top shadow-inner transition-all dark:border-zinc-800 dark:bg-stone-900">
            <header className="flex w-full items-center justify-between pb-2">
              <div className="mx-4 flex w-full items-center border-b border-indigo-400/50 text-lg font-bold text-indigo-400">
                <div className="px-2 font-bold md:text-lg">{title}</div>
              </div>
              <button
                className="cursor-pointer items-center justify-center rounded-md bg-transparent p-2"
                onClick={onClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[40px] w-[40px] rounded-full fill-indigo-400 transition-all duration-200 hover:fill-indigo-500/90"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </header>
            <div className="h-full lg:flex-row lg:gap-6">{children}</div>
          </div>
        </div>
      </Dialog>
    </>
  )
}
