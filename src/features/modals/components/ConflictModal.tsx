import { displayMoveWithPiece } from "@/features/common/utils/displayUtils"

const colorMap = {
  b: "border-gray-300/40 bg-zinc-800 text-gray-300/90 dark:border-gray-300/40 dark:bg-stone-900/80 dark:text-gray-300/90", // Noir
  w: "border-gray-400/70 bg-zinc-100 text-gray-400 dark:border-gray-500 dark:bg-zinc-300 dark:text-gray-500", // white
} as const
export default function ConflictModal({
  oldMove,
  newMove,
  onKeepOriginal,
  onReplaceMove,
  width,
  height,
  repertoireColor,
}) {
  return (
    <div className="flex flex-col gap-4 px-8 pb-8">
      <div className="text-lg dark:text-gray-300 text-gray-600 mb-2">
        You've already saved a different move for this position than the one you
        just played. What would you like to do?
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={onKeepOriginal}
          className="flex flex-wrap items-center border-1 border-indigo-500 justify-center gap-1.5 cursor-pointer rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <p className="min-w-7/12">Keep the original move</p>
          <div
            className={`
                      inline-flex z-60 items-center justify-center select-none   
                      whitespace-nowrap rounded-full border p-2 shadow-sm sm:text-xl xs:text-lg text-xs font-normal 
                      ${colorMap[repertoireColor]}
                    `}
          >
            {displayMoveWithPiece(oldMove, width / 25, width, height, {
              fontSize: 20,
            })}
          </div>
        </button>
        <button
          onClick={onReplaceMove}
          className="flex flex-wrap items-center border-1 border-indigo-500 justify-center gap-1.5 cursor-pointer rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <p className="min-w-7/12">Erase with the new one</p>
          <div
            className={`
                      inline-flex z-60 items-center justify-center select-none   
                      whitespace-nowrap rounded-full border p-2 shadow-sm sm:text-xl xs:text-lg text-xs font-normal 
                      ${colorMap[repertoireColor]}
                    `}
          >
            {displayMoveWithPiece(newMove, width / 25, width, height, {
              fontSize: 20,
            })}
          </div>
        </button>
      </div>
    </div>
  )
}
