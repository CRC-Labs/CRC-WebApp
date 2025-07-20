import React, { useRef, useEffect, useState } from "react"

import { getWidthAndHeight } from "@/features/common/utils/helpers"
import { Icon } from "@/features/common/utils/icons"
import { displayMoveWithPiece } from "@/features/common/utils/displayUtils"

const RadialMenu = ({ closeMenu, position, deleteMoveFromRepertoire }) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const [width, height] = getWidthAndHeight()
  const radius = width / 2
  const x = width / 2
  const y = height / 2
  const menuRef = useRef(null)
  const centerRadius = radius / 2.8
  const sliceCount = 4
  const sliceAngle = (2 * Math.PI) / sliceCount

  useEffect(() => {
    const handleClick = (e) => {
      closeMenu(e)
      setDeleteConfirmation(false)
    }

    const handleRightClick = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    document.addEventListener("click", handleClick)
    document.addEventListener("contextmenu", handleRightClick)
    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("contextmenu", handleRightClick)
    }
  }, [closeMenu])

  // Calcul des positions des slices
  const createSlicePath = (index) => {
    const startAngle = index * sliceAngle - Math.PI / 4
    const endAngle = startAngle + sliceAngle
    let sliceRadius = radius - 20
    return `
      M ${x} ${y}
      m ${sliceRadius * Math.cos(startAngle)} ${sliceRadius * Math.sin(startAngle)}
      a ${sliceRadius} ${sliceRadius} 0 0 1 ${sliceRadius * Math.cos(endAngle) - sliceRadius * Math.cos(startAngle)} ${sliceRadius * Math.sin(endAngle) - sliceRadius * Math.sin(startAngle)}
      L ${x} ${y}
      Z
    `
  }

  const handleDelete = (e) => {
    deleteMoveFromRepertoire(position.fen, position.move)
    closeMenu(e)
    setDeleteConfirmation(false)
  }

  const colorMap = {
    b: "border-gray-300/40 bg-zinc-800 text-gray-300/90 dark:border-gray-300/40 dark:bg-stone-900/80 dark:text-gray-300/90", // Noir
    w: "border-gray-400/70 bg-zinc-100 text-gray-400 dark:border-gray-500 dark:bg-zinc-300 dark:text-gray-500", // white
  } as const

  return (
    <div
      ref={menuRef}
      className="flex items-center justify-center absolute z-50 w-full h-full"
      style={{ left: width / 2 - radius, top: height / 2 - radius }}
    >
      <div className="absolute w-full h-full inset-0 bg-stone-300/80 dark:bg-stone-900/80 z-40" />

      <svg
        className="z-50"
        width={width}
        height={width - width / 9}
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Background circle */}
        <circle
          cx={radius}
          cy={radius}
          r={width / 2}
          className="absolute fill-zinc-600 cursor-pointer z-70"
        />

        {deleteConfirmation ? (
          <>
            <path d={createSlicePath(3)} className="fill-zinc-100" />
            {/* Cancel Slice */}
            <path
              d={createSlicePath(0)}
              className="fill-red-200/90 hover:fill-red-300/90 cursor-pointer"
              onClick={() => setDeleteConfirmation(false)}
            />

            {/* Confirmation Slice */}
            <path
              d={createSlicePath(2)}
              className="fill-green-200/90 hover:fill-green-300/90 cursor-pointer"
              onClick={handleDelete}
            />
          </>
        ) : (
          <>
            {/* Normal state slices */}
            <path d={createSlicePath(0)} className="fill-zinc-100" />
            <path d={createSlicePath(2)} className="fill-zinc-100" />
            <path d={createSlicePath(3)} className="fill-zinc-100" />

            {!position.move.suggestion && (
              <path
                d={createSlicePath(1)}
                className="fill-red-200/90 hover:fill-red-300/90 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setDeleteConfirmation(true)
                }}
              />
            )}
          </>
        )}

        {/* Central menu */}
        <circle
          cx={radius}
          cy={radius}
          r={centerRadius}
          className="absolute fill-zinc-400 cursor-pointer z-50"
          onClick={closeMenu}
        />

        {/* Icons */}
        {deleteConfirmation ? (
          <>
            <foreignObject
              x={width / 2 - width / 10}
              y={height / 2 - height / 10}
              width={width / 5}
              height={height / 5}
            >
              <div
                className={`
            flex h-full w-full z-60 items-center justify-center select-none 
            whitespace-nowrap rounded-full border p-2 shadow-sm sm:text-xl xs:text-lg text-xs
            ${colorMap[position.move.color]}
          `}
              >
                {displayMoveWithPiece(position.move, 1, width, height)}
              </div>
            </foreignObject>
            <foreignObject
              x={width / 8}
              y={height / 2 - height / 12}
              width={width / 5.5}
              height={height / 4}
              className="text-green-600 pointer-events-none"
            >
              <div className="sm:text-xl xs:text-sm text-xs">Yes, delete</div>
              <Icon
                name="Delete"
                style={{ width: radius / 5, height: radius / 5 }}
              />
            </foreignObject>
            <foreignObject
              x={width / 3}
              y={height / 8}
              width={width}
              height={height / 4}
            >
              <div
                className="sm:text-xl xs:text-sm text-xs text-gray-600 pointer-events-none"
                style={{ width: width / 3, height: height / 5 }}
              >
                Do you really want to delete the move ?
              </div>
            </foreignObject>
            <foreignObject
              x={radius + radius / 2}
              y={radius - radius / 6}
              width={width / 6}
              height={height / 4}
              className="text-red-600 pointer-events-none"
            >
              <div className="sm:text-xl xs:text-sm text-xs">No, cancel</div>
              <Icon
                name="Cancel"
                className="text-red-500/50 pointer-events-none"
                style={{ width: radius / 5, height: radius / 5 }}
              />
            </foreignObject>
          </>
        ) : (
          <>
            <foreignObject
              x={width / 12}
              y={height / 2 - height / 10}
              width={width / 5}
              height={height / 5}
            >
              <div
                className={`
            flex h-full w-full z-60 items-center justify-center select-none 
            whitespace-nowrap rounded-full border p-2 shadow-sm sm:text-xl xs:text-lg text-xs
            ${colorMap[position.move.color]}
          `}
              >
                {displayMoveWithPiece(position.move, 20, width, height)}
              </div>
            </foreignObject>
            <foreignObject
              x={radius - radius / 10}
              y={radius + radius / 1.9}
              width={width / 5}
              height={height / 5}
              className="text-red-600 pointer-events-none"
            >
              <Icon
                name="Delete"
                style={{ width: radius / 5, height: radius / 5 }}
              />
            </foreignObject>
            <foreignObject
              x={radius - radius / 10}
              y={radius - radius / 10}
              width={width / 5}
              height={height / 5}
              className="text-gray-500/50 pointer-events-none"
            >
              <Icon
                name="Cancel"
                strokeWidth={1}
                style={{ width: radius / 5, height: radius / 5 }}
              />
            </foreignObject>
          </>
        )}
      </svg>
    </div>
  )
}

export default RadialMenu
