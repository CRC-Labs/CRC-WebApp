import { Icon } from "@/features/common/utils/icons"

function RepertoireCardEditMenu() {
  return (
    <div className="absolute right-[46px] z-40 h-full text-sm">
      <div className="rounded-bl-lg bg-zinc-200 dark:bg-zinc-800">
        <div className="flex flex-col divide-y divide-gray-400/50 rounded-bl-lg border-b border-l border-gray-400/50 bg-zinc-300/50 shadow-inner dark:divide-gray-500 dark:border-gray-500 dark:bg-zinc-700">
          <button
            role="Export"
            className="flex cursor-pointer items-center p-2 text-gray-500/70 hover:bg-zinc-300/90 hover:text-gray-500 dark:text-gray-400 dark:hover:bg-zinc-600/90"
          >
            <Icon className="pointer-events-none ml-2 h-4 w-4" name="Export" />
            <p className="pointer-events-none px-2">Export</p>
          </button>

          <button
            role="Rename"
            className="flex cursor-pointer items-center p-2 text-gray-500/70 hover:bg-zinc-300/90 hover:text-gray-500 dark:text-gray-400 dark:hover:bg-zinc-600/90"
          >
            <Icon className="pointer-events-none ml-2 h-4 w-4" name="Rename" />
            <p className="pointer-events-none px-2">Rename</p>
          </button>

          <button
            role="Delete"
            className="flex cursor-pointer items-center p-2 text-red-600/30 hover:bg-zinc-300/90 hover:text-red-600/80 dark:text-red-200/90 dark:hover:bg-zinc-600/90 dark:hover:text-red-400/90"
          >
            <Icon className="pointer-events-none ml-2 h-4 w-4" name="Delete" />
            <p className="pointer-events-none px-2">Delete</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default RepertoireCardEditMenu
