import { getWidthAndHeight } from "@/features/common/utils/helpers"
import Image from "next/image"
import { useEffect, useState, useCallback, useRef, useMemo } from "react"

// Définition du type pour les dimensions
interface Dimensions {
  width: number
  height: number
}

export default function PromotionModal({
  onClose,
  onPromotionSelect,
  color,
  destinationColumn,
  repertoireColor,
}) {
  // Typage correct des dimensions
  // Initialisation correcte du useRef avec les dimensions
  const dimensionsRef = useRef<Dimensions>({
    width: getWidthAndHeight()[0],
    height: getWidthAndHeight()[1],
  })

  const [dimensions, setDimensions] = useState<Dimensions>(
    dimensionsRef.current,
  )

  const getChessgroundDimensions = useCallback((): Dimensions | null => {
    const cgContainers = document.getElementsByTagName("cg-container")
    if (cgContainers.length > 0) {
      const style = window.getComputedStyle(cgContainers[0])
      return {
        width: parseFloat(style.width.replace("px", "")),
        height: parseFloat(style.height.replace("px", "")),
      }
    }
    return dimensionsRef.current
  }, [])

  // Memoize les valeurs calculées qui ne changent pas souvent
  const isBoardFlipped = useMemo(
    () => repertoireColor === "b",
    [repertoireColor],
  )
  const shouldReverseVertically = useMemo(
    () => color !== repertoireColor,
    [color, repertoireColor],
  )

  // Memoize columnMapping pour éviter les recalculs inutiles
  const columnMapping = useMemo(() => {
    const squareSize = dimensions.width / 8
    return {
      a: isBoardFlipped ? `${dimensions.width - squareSize}px` : "0px",
      b: isBoardFlipped
        ? `${dimensions.width - squareSize * 2}px`
        : `${squareSize}px`,
      c: isBoardFlipped
        ? `${dimensions.width - squareSize * 3}px`
        : `${squareSize * 2}px`,
      d: isBoardFlipped
        ? `${dimensions.width - squareSize * 4}px`
        : `${squareSize * 3}px`,
      e: isBoardFlipped
        ? `${dimensions.width - squareSize * 5}px`
        : `${squareSize * 4}px`,
      f: isBoardFlipped
        ? `${dimensions.width - squareSize * 6}px`
        : `${squareSize * 5}px`,
      g: isBoardFlipped
        ? `${dimensions.width - squareSize * 7}px`
        : `${squareSize * 6}px`,
      h: isBoardFlipped
        ? `${dimensions.width - squareSize * 8}px`
        : `${squareSize * 7}px`,
    }
  }, [dimensions.width, isBoardFlipped])

  const modalRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        modalRef.current &&
        !(modalRef.current as HTMLElement).contains(event.target as Node)
      ) {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      }
    }

    // Ajouter les event listeners
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [onClose])

  // Optimisation du ResizeObserver avec throttle
  useEffect(() => {
    let frameId
    let throttleTimeout
    const observerRef = new ResizeObserver((entries) => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          frameId = requestAnimationFrame(() => {
            const newDimensions = getChessgroundDimensions()
            if (newDimensions) {
              dimensionsRef.current = newDimensions
              setDimensions(newDimensions)
            }
            throttleTimeout = null
          })
        }, 16) // ~60fps
      }
    })

    const cgContainers = document.getElementsByTagName("cg-container")
    if (cgContainers.length > 0) {
      observerRef.observe(cgContainers[0])
    }

    return () => {
      observerRef.disconnect()
      if (frameId) cancelAnimationFrame(frameId)
      if (throttleTimeout) clearTimeout(throttleTimeout)
    }
  }, [getChessgroundDimensions])

  // Memoize pieces array
  const pieces = useMemo(
    () =>
      shouldReverseVertically ? ["n", "b", "r", "q"] : ["q", "r", "b", "n"],
    [shouldReverseVertically],
  )

  // Memoize vertical position calculation
  const verticalPosition = useMemo(() => {
    const squareSize = dimensions.width / 8
    if (isBoardFlipped) {
      return color === "w" ? `${dimensions.height - squareSize * 4}px` : "0px"
    }
    return color === "b" ? "0px" : `${dimensions.height - squareSize * 4}px`
  }, [dimensions, isBoardFlipped, color])

  // Memoize click handler
  const handlePieceClick = useCallback(
    (piece) => {
      onClose()
      onPromotionSelect(piece)
    },
    [onClose, onPromotionSelect],
  )

  return (
    <div className="absolute w-full h-full bg-black/70 z-50">
      <div
        ref={modalRef}
        className="absolute grid w-full grid-rows-4 z-60"
        style={{
          left: columnMapping[destinationColumn],
          top: verticalPosition,
          width: dimensions.width / 8,
        }}
      >
        {pieces.map((piece) => (
          <div
            key={piece}
            onClick={() => handlePieceClick(piece)}
            className="relative cursor-pointer"
            style={{
              width: dimensions.width / 8,
              height: dimensions.height / 8,
            }}
          >
            <div className="rounded-full bg-gray-900 h-full w-full">
              <div className="flex items-center justify-center rounded-full bg-gray-200/40 h-full w-full hover:bg-green-300/50">
                <Image
                  src={`./chessPieces/${color}_${piece.toUpperCase()}.svg`}
                  alt={piece.toUpperCase()}
                  width={(dimensions.width - 80) / 8}
                  height={(dimensions.height - 80) / 8}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
