import { ChessMove } from "../../../types/ChessMove"
import {
  firstIsUppercase,
  getPieceImagePathFromSan,
} from "@/features/common/utils/utils"

/**
 * Displays the given move with its piece icon, if applicable.
 * The function first determines the font size based on the width of the board and the given piece size ratio.
 * If the move is a big castle, the function sets a smaller font size.
 * If the move is not a castle and the first character of the SAN is uppercase, the function displays the piece icon with the move.
 * Otherwise, the function displays only the SAN.
 * @param move The move to display.
 * @param pieceSizeRatio The ratio of the piece size to the board size.
 * @param width The board size.
 * @param height The the board size.
 * @param customStyle React.CSSProperties
 * @returns The JSX element that displays the move with its piece icon, if applicable.
 */
export function displayMoveWithPiece(
  move: ChessMove,
  pieceSizeRatio: number,
  width: number,
  height: number,
  customStyle?: React.CSSProperties,
) {
  let style = customStyle || { fontSize: width / 25 }

  if (!customStyle && move.san.startsWith("O-O-O") && pieceSizeRatio === 20) {
    style = { fontSize: width / 35 }
  }

  if (
    !move.san.startsWith("O-O") &&
    !move.san.startsWith("O-O-O") &&
    firstIsUppercase(move.san)
  ) {
    let svg = (
      <svg width={width / pieceSizeRatio} height={height / pieceSizeRatio}>
        <image
          xlinkHref={getPieceImagePathFromSan(move.san, move.color)}
          width={width / pieceSizeRatio}
          height={height / pieceSizeRatio}
        />
      </svg>
    )
    return (
      <>
        {svg}
        <span className="flex items-center justify-center" style={style}>
          {move.san.slice(1)}
        </span>
      </>
    )
  }
  return (
    <span className="flex items-center justify-center" style={style}>
      {move.san}
    </span>
  )
}
