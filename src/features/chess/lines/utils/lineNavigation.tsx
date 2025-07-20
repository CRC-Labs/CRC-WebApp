import { ChessLine, CurrentLineData } from "../../../../types/ChessLine"

/**
 * Finds the current ChessLine object and its parent based on the current position of the chess board.
 *
 * This function recursively traverses the line tree structure to locate the specific line
 * that matches the current position and PGN. It's used to determine where in the repertoire
 * tree the current chess position is located.
 *
 * @param parentLine - The parent ChessLine object to search within
 * @param pgn - The PGN string representing the current position
 * @param currentFen - The FEN string of the current position
 * @returns An object containing the current line, its parent, and last move index, or null if not found
 */
export function findCurrentLine(
  parentLine: ChessLine,
  pgn: string,
  currentFen: string,
): CurrentLineData {
  // Exit early if parent line is null
  let lmIndex = -1
  if (parentLine == null) {
    return null
  }

  // Iterate through all children of the parent line
  for (const child of parentLine.children) {
    // Check if the child's PGN matches or contains the current PGN
    // This handles both exact matches and cases where we're viewing a subset of a line
    if (child.pgn.startsWith(pgn) || pgn.startsWith(child.pgn)) {
      // Try to find the exact move in this child's sequence
      lmIndex = findMoveIndex(child, currentFen)

      if (lmIndex === -1) {
        // If the move isn't in this child's sequence directly, search deeper in its children
        return findCurrentLine(child, pgn, currentFen)
      }

      // Move found - return this line, its parent, and the move's index
      return {
        currentLine: child,
        parentLine: parentLine,
        lmIndex: findMoveIndex(child, currentFen),
      }
    }
  }

  // Position not found in any child line
  return null
}

/**
 * Finds the index of a specific move in a ChessLine's move sequence by matching FEN.
 *
 * This function iterates through all moves in the sequence and returns the index
 * of the move that results in the specified chess position (identified by FEN).
 *
 * @param currentLine - The ChessLine object to search in
 * @param currentFen - The FEN string to match against move results
 * @returns The index of the matching move, or -1 if no match is found
 */
export function findMoveIndex(currentLine: ChessLine, currentFen: String) {
  let moveNumber = 0
  let lmIndex = -1

  // Check each move in the sequence
  for (const moveInSequence of currentLine.moveSequence) {
    // If this move results in the target position, we found our match
    if (moveInSequence.nextFen === currentFen) {
      lmIndex = moveNumber
      break
    }

    // Move to next move in sequence
    moveNumber++
  }

  // Return the index of the matching move (or -1 if not found)
  return lmIndex
}
