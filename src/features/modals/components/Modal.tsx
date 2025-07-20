import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop avec transition simplifiée */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-all"
        data-closed="opacity-0 backdrop-blur-none"
      />

      <div className="fixed inset-0 grid place-items-center p-4 ">
        <DialogPanel
          className="w-full max-w-xl rounded-lg xs:p-6 shadow-xl max-h-full overflow-y-auto p-0 border-gray-400/80 bg-stone-300 dark:bg-stone-900 dark:border-gray-500/80 border-1 border-indigo-500"
          transition
          data-closed="opacity-0 scale-95"
          data-enter="duration-300 ease-out"
          data-leave="duration-200 ease-in"
        >
          <DialogTitle className="text-lg font-bold">
            <header className="flex w-full items-center justify-between">
              <div className="mx-4 flex w-full items-center border-b border-indigo-400/50 text-lg font-bold text-indigo-400">
                <div className="p-2 font-bold md:text-lg">{title}</div>
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
          </DialogTitle>
          <div>{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
