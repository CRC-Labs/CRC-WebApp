function ModalFooterButtonBar({ cancelLabel, okLabel, onSubmit, cancelFunc }) {
  return (
    <footer className="mt-4 flex w-full flex-col items-center rounded-lg border-t border-zinc-200 pt-4 dark:border-zinc-800 sm:max-w-[40vw]">
      <div className="my-4 flex items-center divide-x divide-gray-300 rounded-lg border border-gray-300 bg-zinc-200 shadow-sm ring-1 ring-slate-900/10 dark:divide-gray-500 dark:border-gray-500 dark:bg-zinc-900 dark:ring-0">
        <button
          type="reset"
          onClick={cancelFunc}
          className="flex justify-center rounded-l-lg px-4 text-xs font-bold text-orange-800/40 shadow-sm outline-none transition-all duration-200 hover:bg-zinc-300/50 hover:text-orange-500/90 hover:shadow-inner focus:bg-zinc-300/50 focus:text-orange-500/90 focus:shadow-inner dark:text-orange-400/70 dark:hover:bg-zinc-700/70 dark:hover:text-orange-600 dark:focus:bg-zinc-700/70 dark:focus:text-orange-600"
        >
          <p className="mb-2 pt-2">{cancelLabel}</p>
        </button>
        <button
          type="submit"
          onClick={onSubmit}
          className="flex justify-center rounded-r-lg px-4 text-xs font-bold text-emerald-800/60 shadow-sm outline-none transition-all duration-200 hover:bg-zinc-300/50 hover:text-emerald-500/80 hover:shadow-inner focus:bg-zinc-300/50 focus:text-emerald-500/80 focus:shadow-inner dark:text-emerald-300/70 dark:hover:bg-zinc-700/70 dark:hover:text-emerald-500 dark:focus:bg-zinc-700/70 dark:focus:text-emerald-500"
        >
          <p className="mb-2 pt-2">{okLabel}</p>
        </button>
      </div>
    </footer>
  )
}

export default ModalFooterButtonBar
