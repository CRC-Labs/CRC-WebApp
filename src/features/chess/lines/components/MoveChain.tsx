// In MoveChain.jsx - Add move context menu functionality
import { getLinePgnUpToIndex } from "@/features/chess/logic/utils/pgnUtils"
import { Icon } from "@/features/common/utils/icons"
import {
  firstIsUppercase,
  getPieceImagePathFromSan,
} from "@/features/common/utils/utils"
import { useMoveState } from "./MoveStateProvider"

export const trailComponent = (
  <div className="flex h-[35px] items-center justify-center ">
    <div className="h-[2px] w-2 bg-gray-300 dark:bg-gray-400/40"></div>
  </div>
)

function displayMoveWithPiece(move) {
  if (
    move.san !== "O-O" &&
    move.san !== "O-O-O" &&
    firstIsUppercase(move.san)
  ) {
    let svg = (
      <svg width={20} height={20}>
        <image
          xlinkHref={getPieceImagePathFromSan(move.san, move.color)}
          width={20}
          height={20}
        />
      </svg>
    )
    return (
      <div className="flex items-center gap-[1px]">
        {svg}
        <p>{move.san.slice(1)}</p>
      </div>
    )
  }
  return <p>{move.san}</p>
}

export default function MoveChain({ line, loadPgn, onMoveContextMenu }) {
  const { getMoveState, getMoveClasses } = useMoveState()

  // In MoveChain.jsx - Update handleMoveRightClick
  const handleMoveRightClick = (e, move, moveIndex) => {
    e.preventDefault()
    e.stopPropagation()

    if (onMoveContextMenu) {
      const rect = e.currentTarget.getBoundingClientRect()
      onMoveContextMenu({
        move,
        moveIndex,
        line,
        triggerRect: rect, // Pass the trigger element's rect
      })
    }
  }

  let elements = []

  for (let i = 0; i < line.moveSequence.length; i++) {
    const move = line.moveSequence[i]
    const moveState = getMoveState(line.pgn, i, move)

    if (move.color === "b") {
      // Base classes for black moves
      const baseClasses = `
        move-item cursor-pointer
        flex h-[35px] w-fit items-center justify-center whitespace-nowrap rounded-full 
        border bg-zinc-800 p-2 text-gray-300/90 shadow-sm
        dark:bg-stone-900/80 dark:text-gray-300/90
        border-gray-300/40 dark:border-gray-300/40
      `

      // Get final classes with state-specific styling
      const finalClasses = getMoveClasses(moveState, baseClasses)

      elements.push(
        <div
          className="flex pb-[5px]"
          key={line.id + i + move.san + move.color}
        >
          {trailComponent}
          <div
            onClick={(e) => {
              loadPgn(line.pgn, line.moveSequence.length - (i + 1))
              e.preventDefault()
              e.stopPropagation()
            }}
            onContextMenu={(e) => handleMoveRightClick(e, move, i)}
            className={finalClasses}
          >
            {displayMoveWithPiece(move)}
          </div>
        </div>,
      )
    } else {
      // Similar logic for white moves
      let sep = Math.trunc((i + line.depth) / 2 + 1.5)

      const baseClasses = `
        move-item cursor-pointer
        flex max-h-[35px] w-fit items-center justify-center whitespace-nowrap rounded-full
        border bg-zinc-100 p-2 text-gray-400 shadow-sm 
        dark:bg-zinc-300 dark:text-gray-500
        border-gray-400/70 dark:border-gray-500
      `

      const finalClasses = getMoveClasses(moveState, baseClasses)

      elements.push(
        <div
          className="flex items-center pb-[5px]"
          key={line.id + i + move.san + move.color}
        >
          {trailComponent}
          <p className="px-1 text-gray-500/50 dark:text-gray-300/50">{sep}</p>
          {trailComponent}
          <div
            onClick={(e) => {
              loadPgn(line.pgn, line.moveSequence.length - (i + 1))
              e.preventDefault()
              e.stopPropagation()
            }}
            onContextMenu={(e) => handleMoveRightClick(e, move, i)}
            className={finalClasses}
          >
            {displayMoveWithPiece(move)}
          </div>
        </div>,
      )
    }
  }

  // Transposition handling (unchanged)
  if (line.transposition) {
    elements.push(
      <div className="flex pb-[5px]" key={line.id + "transpose"}>
        {trailComponent}
        <div
          onClick={(e) => {
            loadPgn(
              getLinePgnUpToIndex(
                line.transposition.line,
                line.transposition.moveIndex,
              ),
            )
            e.preventDefault()
            e.stopPropagation()
          }}
          className={`
            flex h-[35px] w-fit items-center justify-center whitespace-nowrap rounded-full 
            border bg-blue-900/80 p-2 text-gray-200/90 shadow-sm
            dark:bg-blue-900/80 dark:text-gray-300/90`}
        >
          <Icon
            name="Transpose"
            fill="currentColor"
            style={{
              width: "15pt",
              height: "15pt",
            }}
          />
        </div>
      </div>,
    )
  }

  return <div className="flex flex-wrap sm:text-lg text-sm">{elements}</div>
}
