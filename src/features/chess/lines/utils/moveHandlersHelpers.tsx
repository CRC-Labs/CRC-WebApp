import { computePgnFromMoveSequence } from "../../logic/utils/pgnUtils"
import { ChessLine, CurrentLineData } from "../../../../types/ChessLine"
import { ChessMove } from "../../../../types/ChessMove"
import { isEqual } from "lodash"

/**
 * Appends a sequence of moves to a line and updates its PGN representation.
 * This maintains consistency between the move sequence and the PGN string.
 *
 * @param toAdd - Array of chess moves to append
 * @param currentLine - The line to which moves will be added
 */
export function appendMovesToSequenceAndUpdatePgn(
  toAdd: ChessMove[],
  currentLine: ChessLine,
) {
  // Compute PGN for the new moves
  let pgnFromMoveSequence = computePgnFromMoveSequence(
    toAdd,
    currentLine.depth + currentLine.moveSequence.length,
  )

  // Update the line's PGN by appending the new moves
  currentLine.pgn = (currentLine.pgn + " " + pgnFromMoveSequence)
    .trimStart()
    .replace(/\s{2,}/g, " ")

  // Update ID to match the PGN for consistency
  currentLine.id = currentLine.pgn

  // Append the moves to the move sequence
  currentLine.moveSequence = currentLine.moveSequence.concat(toAdd)
}

/**
 * A function to find the `ChessLine` object containing a given move in the `moveSequence` array of a parent `ChessLine` object.
 *
 * @param parentLine The parent `ChessLine` object to search for the move in.
 * @param move The `ChessMove` object to search for.
 * @returns An object containing the `ChessLine` object containing the move, its parent `ChessLine` object, and the index of the move in the `moveSequence` array, or `null` if the move could not be found.
 */
export function findLineWithMove(
  parentLine: ChessLine,
  move: ChessMove,
): CurrentLineData {
  let moveIndex = -1

  // Iterate over the children of the parent `ChessLine` object using a `for...of` loop
  for (const child of parentLine.children) {
    // Find the index of the move in the `moveSequence` array of the child `ChessLine` object
    moveIndex = findMoveIndexInLine(child, move)
    if (moveIndex !== -1) {
      // If the move is found in the child `ChessLine` object, return an object containing the child `ChessLine` object, its parent `ChessLine` object, and the index of the move in the `moveSequence` array
      return {
        currentLine: child,
        parentLine: parentLine,
        lmIndex: moveIndex,
      }
    }
  }

  // If the move is not found in any of the children of the parent `ChessLine` object, recursively search for the move in the children of the children
  if (moveIndex === -1 && parentLine.children.length > 0) {
    for (const child of parentLine.children) {
      let lineData = findLineWithMove(child, move)
      if (lineData !== null) {
        return lineData
      }
    }
  }

  // If the move is not found in any of the children of the parent `ChessLine` object or its descendants, return `null`
  return null
}

/**
 * A function to find the index of a move in the `moveSequence` array of a `ChessLine` object.
 *
 * @param line The `ChessLine` object to find the move in.
 * @param move The `ChessMove` object to find the index of.
 * @returns An integer representing the index of the move in the `moveSequence` array, or -1 if the move could not be found.
 */
export function findMoveIndexInLine(line: ChessLine, move: ChessMove) {
  let moveNumber = 0
  let moveIndex = -1

  // Iterate over the `moveSequence` array of the `ChessLine` object using a `for...of` loop
  for (const moveInSequence of line.moveSequence) {
    // Check if the current move in the sequence is equal to the move being searched for
    if (isEqual(moveInSequence, move)) {
      // If the move is found, set the `moveIndex` variable to the current `moveNumber` and return it
      moveIndex = moveNumber
      return moveIndex
    }

    // If the move is not found, increment the `moveNumber` variable
    moveNumber++
  }

  // If the move is not found, return -1
  return moveIndex
}
