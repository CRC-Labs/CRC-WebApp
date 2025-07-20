import { ChessMove } from "../../../../types/ChessMove"
import { ChessRepertoire } from "../../../../types/Repertoire"
import { ChessLine, TranspositionElement } from "../../../../types/ChessLine"
import { determineMoveSeparator } from "../../logic/utils/pgnUtils"
import { appendMovesToSequenceAndUpdatePgn } from "./moveHandlersHelpers"
import { sanitizeFen } from "../../../../features/common/utils/utils"
import { findOpeningNameForPgn } from "../../logic/utils/openingsUtils"

/**
 * Converts a chess repertoire into a tree structure of chess lines.
 *
 * This function processes all positions in the repertoire starting from the initial position
 * and creates a hierarchical structure representing all variations in the repertoire.
 * It also builds an index of transpositions (same positions reached via different move orders).
 *
 * @param repertoire - The chess repertoire to convert
 * @param maxDepth - Maximum recursion depth to prevent infinite loops (default: 50)
 * @returns An object containing the root of the line tree and a transposition index
 */
export function convertRepertoireToChessLine(
  repertoire: ChessRepertoire,
  openingsMap?: Map<string, string>,
  maxDepth = 50,
): {
  root: ChessLine
  transpositionIndex: Map<string, TranspositionElement>
} {
  // Create the root node and transposition index
  const root = new ChessLine("", "", [], [], 0)
  const transpositionIndex = new Map<string, TranspositionElement>()

  // Set root opening (if any)
  root.opening = findOpeningNameForPgn("", openingsMap) || ""

  // Get the starting position FEN
  const startingPosition = sanitizeFen(repertoire.startingPosition)

  // Early return if repertoire is empty
  if (repertoire.positions.size === 0) {
    return { root, transpositionIndex }
  }

  // Get the starting position from the repertoire
  const startPosition = repertoire.positions.get(startingPosition)
  if (!startPosition) {
    return { root, transpositionIndex }
  }

  // Process each move from the starting position
  for (const [san, move] of startPosition.moves.entries()) {
    // Create a new line for this initial move
    const moveSequence = [move]
    const pgn = "1. " + san
    const child = new ChessLine(pgn, pgn, moveSequence, [], 0)

    if (openingsMap) {
      child.opening = openingsMap.get(child.pgn) || root.opening
    }
    // Add to the root's children
    root.children.push(child)

    // Continue building the tree from this position
    buildChessLine(
      child,
      sanitizeFen(move.nextFen) || "",
      repertoire,
      transpositionIndex,
      0,
      maxDepth,
      openingsMap,
    )
  }

  return { root, transpositionIndex }
}

/**
 * Recursively builds a chess line tree from a specific position.
 *
 * This function processes a position, adds appropriate moves to the current line,
 * handles transpositions, and creates child lines when multiple moves are available.
 * It's the core engine for building the repertoire tree structure.
 *
 * @param currentLine - The current chess line being processed
 * @param currentFen - The FEN string of the current position
 * @param repertoire - The chess repertoire being processed
 * @param transpositionIndex - Map of positions to their transposition data
 * @param currentDepth - Current recursion depth
 * @param maxDepth - Maximum recursion depth (default: 50)
 * @returns The processed chess line
 */
export function buildChessLine(
  currentLine: ChessLine,
  currentFen: string,
  repertoire: ChessRepertoire,
  transpositionIndex: Map<string, TranspositionElement>,
  currentDepth: number,
  maxDepth = 50,
  openingsMap?: Map<string, string>,
): ChessLine {
  // Safety check to prevent infinite recursion
  if (currentDepth >= maxDepth) {
    return currentLine
  }

  // Add this position to the transposition index if not already present
  if (!transpositionIndex.has(currentFen)) {
    transpositionIndex.set(currentFen, {
      line: currentLine,
      moveIndex: Math.max(currentLine.moveSequence.length - 1, 0),
      usedIn: undefined,
    })
  }

  // Get the current position from the repertoire
  const position = repertoire.positions.get(currentFen)
  if (!position) {
    return currentLine // Leaf node - position not in repertoire
  }

  // Case 1: Position has exactly one move - add it to the current line
  if (position.moves.size === 1) {
    return handleSingleMovePosition(
      currentLine,
      position,
      repertoire,
      transpositionIndex,
      currentDepth,
      maxDepth,
      openingsMap,
    )
  }
  // Case 2: Position has multiple moves - create child lines
  else if (position.moves.size > 1) {
    return handleMultiMovePosition(
      currentLine,
      position,
      repertoire,
      transpositionIndex,
      currentDepth,
      maxDepth,
      openingsMap,
    )
  }

  return currentLine
}

/**
 * Handles a position with a single move by extending the current line.
 *
 * This is a helper function extracted from buildChessLineEnhanced to improve readability.
 * When a position has only one move, we append it to the current line rather than
 * creating a new branch.
 *
 * @param currentLine - The current chess line being processed
 * @param position - The current position from the repertoire
 * @param repertoire - The chess repertoire being processed
 * @param transpositionIndex - Map of positions to their transposition data
 * @param currentDepth - Current recursion depth
 * @param maxDepth - Maximum recursion depth
 * @returns The processed chess line
 */
function handleSingleMovePosition(
  currentLine: ChessLine,
  position: { moves: Map<string, ChessMove> },
  repertoire: ChessRepertoire,
  transpositionIndex: Map<string, TranspositionElement>,
  currentDepth: number,
  maxDepth: number,
  openingsMap?: Map<string, string>,
): ChessLine {
  // Get the single move from this position
  const [san, move] = Array.from(position.moves.entries())[0]
  const nextFen = sanitizeFen(move.nextFen) || ""

  // Add the move to the current line
  appendMovesToSequenceAndUpdatePgn([move], currentLine)
  if (openingsMap) {
    currentLine.opening =
      findOpeningNameForPgn(currentLine.pgn, openingsMap) || currentLine.opening
  }

  // Add next position to transposition index if not already present
  if (nextFen && !transpositionIndex.has(nextFen)) {
    transpositionIndex.set(nextFen, {
      line: currentLine,
      moveIndex: currentLine.moveSequence.length - 1,
      usedIn: undefined,
    })
  }

  // Check if next position is a transposition (already indexed from another line)
  let transpositionElement = transpositionIndex.get(nextFen)
  if (transpositionElement && transpositionElement.line !== currentLine) {
    // This position can be reached from another line - handle the transposition
    handleTransposition(
      transpositionIndex,
      transpositionElement,
      currentLine,
      nextFen,
    )
    return currentLine
  } else if (nextFen) {
    const nextPosition = repertoire.positions.get(nextFen)
    if (!nextPosition || nextPosition.moves.size === 0) {
      return currentLine // Leaf node
    }

    // Continue building the line with the next position
    let updatedLine = buildChessLine(
      currentLine,
      nextFen,
      repertoire,
      transpositionIndex,
      currentDepth + 1,
      maxDepth,
      openingsMap,
    )
    // Update unfinished flag, respecting transposition
    if (updatedLine.transposition) {
      // If the line uses a transposition, synchronize with the referenced line
      updatedLine.unfinished = false
    } else {
      // Normal unfinished status logic
      const lastMove =
        updatedLine.moveSequence[updatedLine.moveSequence.length - 1]
      if (
        lastMove.color !== repertoire.color &&
        updatedLine.children.length === 0
      ) {
        updatedLine.unfinished = true
      } else {
        updatedLine.unfinished = false
      }
    }
    return updatedLine
  }

  return currentLine
}

/**
 * Handles a position with multiple moves by creating child lines.
 *
 * This is a helper function extracted from buildChessLineEnhanced to improve readability.
 * When a position has multiple possible moves, we create a separate branch for each one.
 *
 * @param currentLine - The current chess line being processed
 * @param position - The current position from the repertoire
 * @param repertoire - The chess repertoire being processed
 * @param transpositionIndex - Map of positions to their transposition data
 * @param currentDepth - Current recursion depth
 * @param maxDepth - Maximum recursion depth
 * @returns The processed chess line
 */
function handleMultiMovePosition(
  currentLine: ChessLine,
  position: any,
  repertoire: ChessRepertoire,
  transpositionIndex: Map<string, TranspositionElement>,
  currentDepth: number,
  maxDepth: number,
  openingsMap?: Map<string, string>,
): ChessLine {
  // Process each possible move from this position
  for (const [san, move] of position.moves.entries()) {
    const nextFen = sanitizeFen(move.nextFen) || ""
    const nextPosition = repertoire.positions.get(nextFen)

    // Create a new child line for this move
    const child = createChildLine(currentLine, move, san)

    // Add the child to the current line
    currentLine.children.push(child)
    if (openingsMap) {
      child.opening = openingsMap.get(child.pgn) || currentLine.opening
    }

    // Add next position to transposition index if not already present
    if (nextFen && !transpositionIndex.has(nextFen)) {
      transpositionIndex.set(nextFen, {
        line: child,
        moveIndex: child.moveSequence.length - 1,
        usedIn: undefined,
      })
    }

    // Check if next position is a transposition
    let transpositionElement = transpositionIndex.get(nextFen)
    if (transpositionElement && transpositionElement.line !== child) {
      handleTransposition(
        transpositionIndex,
        transpositionElement,
        child,
        nextFen,
      )
      continue
    } else if (!nextPosition || nextPosition.moves.size === 0) {
      // Handle leaf node
      handleEmptyNextPosition(repertoire, child, currentLine, move)
    } else {
      // Continue building the tree from this child line
      buildChessLine(
        child,
        nextFen,
        repertoire,
        transpositionIndex,
        currentDepth + 1,
        maxDepth,
        openingsMap,
      )
    }
  }

  // A line with children is never unfinished since it has continuations
  currentLine.unfinished = false

  return currentLine
}

/**
 * Creates a new child line for a specific move.
 *
 * This helper function encapsulates the logic for creating a new chess line
 * with the correct PGN notation and move sequence.
 *
 * @param parentLine - The parent chess line
 * @param move - The chess move to add
 * @param san - The SAN notation of the move
 * @returns A new chess line containing the move
 */
function createChildLine(
  parentLine: ChessLine,
  move: ChessMove,
  san: string,
): ChessLine {
  const moveSequence = [move]
  const separator = determineMoveSeparator(
    parentLine.depth + parentLine.moveSequence.length,
    parentLine.id,
  )
  const childPgn = parentLine.pgn + separator + san

  return new ChessLine(
    childPgn,
    childPgn,
    moveSequence,
    [],
    parentLine.depth + parentLine.moveSequence.length,
  )
}

/**
 * Handles the case where a position has no following moves.
 *
 * This function processes leaf nodes in the repertoire tree and sets
 * appropriate flags based on whose move it is.
 *
 * @param repertoire - The chess repertoire being processed
 * @param newLine - The new leaf line
 * @param parentLine - The parent line
 * @param move - The last move in the line
 */
function handleEmptyNextPosition(
  repertoire: ChessRepertoire,
  newLine: ChessLine,
  parentLine: ChessLine,
  move: ChessMove,
): void {
  // Get the last move in the sequence
  const lastMove = newLine.moveSequence.slice(-1)[0]

  // Mark the line as unfinished if the last move is the opponent's
  // This indicates that a response is needed in the repertoire
  if (!newLine.transposition && lastMove.color !== repertoire.color) {
    newLine.unfinished = true
  }

  // Ensure the parent line is not marked as unfinished
  // since it has at least one child continuation
  parentLine.unfinished = false
}

/**
 * Handles transpositions between different chess lines.
 *
 * A transposition occurs when the same position can be reached via different move orders.
 * This function updates the transposition index and establishes the relationships between
 * lines that lead to the same position.
 *
 * @param transpositionIndex - Map of positions (FEN) to their transposition data
 * @param transpositionElement - The existing transposition element for this position
 * @param line - The current line that transposes to an existing position
 * @param fen - The FEN string of the transposition position
 */
export function handleTransposition(
  transpositionIndex: Map<string, TranspositionElement>,
  transpositionElement: TranspositionElement,
  line: ChessLine,
  fen: string,
) {
  if (transpositionElement.usedIn !== undefined) {
    // Case: Position already used by other lines
    // Add current line to references
    const newReference = {
      moveIndex: line.moveSequence.length - 1,
      line: line,
    }

    // Add the new reference to the list of lines using this transposition
    transpositionElement.usedIn.push(newReference)

    // Update the transposition reference in the current line
    line.transposition = transpositionElement
  } else {
    // Case: First time encountering this transposition with multiple lines
    const existingLine = transpositionElement.line

    // Create reference the line
    let newTranspositonReferenceLine = {
      moveIndex: line.moveSequence.length - 1,
      line: line,
    }

    // Initialize the usedIn array with both references
    transpositionElement.usedIn = [newTranspositonReferenceLine]

    // Update the transposition index
    transpositionIndex.set(fen, transpositionElement)

    // Update reference
    line.transposition = transpositionElement
    existingLine.flags.isShared = true
  }
  line.unfinished = false //Using a transposition
}
