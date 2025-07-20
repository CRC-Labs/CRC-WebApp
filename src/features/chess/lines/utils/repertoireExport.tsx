import { ChessLine } from "../../../../types/ChessLine"

import { ChessRepertoire } from "../../../../types/Repertoire"

// ✅ Enhanced function signature with proper parameters
export function exportRepertoireToPgn(
  linesData: ChessLine,
  repertoire?: ChessRepertoire,
  customDate?: string,
): string {
  // ✅ Proper date formatting
  let validDate = new Date().toISOString().split("T")[0].replace(/-/g, ".")
  if (customDate && typeof customDate === "string") {
    validDate = customDate
  }

  // ✅ Generate enhanced headers with repertoire info
  const headers = generatePgnHeaders(validDate, repertoire)
  const mainContent = generateMainPgnContent(
    linesData,
    repertoire?.color as "white" | "black",
  )
  return `${headers}\n\n${mainContent}`
}

// ✅ Enhanced PGN headers with repertoire information
function generatePgnHeaders(
  date: string,
  repertoire?: ChessRepertoire,
): string {
  const headers = []

  // Basic PGN headers with repertoire info
  headers.push('[Event "Chess Repertoire"]')
  headers.push('[Site "Chess Repertoire Companion"]')
  headers.push(`[Date "${date}"]`)
  // ✅ Set player colors based on repertoire
  if (repertoire?.color === "w") {
    headers.push('[White "Repertoire Owner"]')
    headers.push('[Black "Opponent"]')
  } else if (repertoire?.color === "b") {
    headers.push('[White "Opponent"]')
    headers.push('[Black "Repertoire Owner"]')
  } else {
    headers.push('[White "?"]')
    headers.push('[Black "?"]')
  }
  // ✅ Add custom repertoire-specific headers
  if (repertoire) {
    headers.push("") // Empty line before custom headers
    headers.push(`[RepertoireId "${repertoire.id}"]`)
    headers.push(`[RepertoireName "${repertoire.title}"]`)
    headers.push(
      `[RepertoireColor "${repertoire.color === "w" ? "White" : "Black"}"]`,
    )

    if (
      repertoire.startingPosition &&
      repertoire.startingPosition !==
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    ) {
      headers.push(`[FEN "${repertoire.startingPosition}"]`)
      headers.push('[SetUp "1"]')
    }

    // Add position count as metadata
    if (repertoire.positions) {
      headers.push(`[PositionCount "${repertoire.positions.size}"]`)
    }
  }

  return headers.join("\n")
}

function generateMainPgnContent(
  root: ChessLine,
  repertoireType?: "white" | "black",
): string {
  if (root.children.length === 0) {
    return "*"
  }

  let result = ""

  // Handle white repertoire special case ONLY if explicitly specified
  if (repertoireType === "white" && root.children.length === 1) {
    // WHITE REPERTOIRE: Special case - process complete moveSequence first
    const firstLine = root.children[0]

    // Process complete moveSequence of the single child
    if (firstLine.moveSequence && firstLine.moveSequence.length > 0) {
      result += formatMoveSequence(firstLine.moveSequence, firstLine.depth)
    }

    // Then apply recursive logic to this line's children
    if (firstLine.children.length > 0) {
      const continuation = processLineRecursive(firstLine)
      if (continuation) {
        result += ` ${continuation}`
      }
    }
  } else {
    // BLACK REPERTOIRE or AMBIGUOUS: Always use recursive logic
    result = processLineRecursive(root)
  }

  // Add PGN termination marker
  return `${result} *`
}

/**
 * Recursive processing for lines:
 * 1. Add first move of first child (if exists)
 * 2. Process other children as variations
 * 3. Continue with remaining moves of first child + its children
 */
function processLineRecursive(line: ChessLine): string {
  if (line.children.length === 0) {
    return ""
  }

  let result = ""
  const mainChild = line.children[0]

  // Step 1: Add first move of main child
  if (mainChild.moveSequence && mainChild.moveSequence.length > 0) {
    result += formatSingleMove(mainChild.moveSequence[0], mainChild.depth)
  }

  // Step 2: Process other children as variations
  if (line.children.length > 1) {
    const variations = line.children.slice(1)
    for (const variation of variations) {
      const variationPgn = processVariation(variation)
      if (variationPgn) {
        result += ` (${variationPgn})`
      }
    }
  }

  // Step 3: Continue with remaining moves of main child
  if (mainChild.moveSequence && mainChild.moveSequence.length > 1) {
    const remainingMoves = mainChild.moveSequence.slice(1)
    if (remainingMoves.length > 0) {
      result += " " + formatMoveSequence(remainingMoves, mainChild.depth + 1)
    }
  }

  // Step 4: Continue recursively with main child's children
  if (mainChild.children.length > 0) {
    const continuation = processLineRecursive(mainChild)
    if (continuation) {
      result += ` ${continuation}`
    }
  }

  return result
}

/**
 * Processes a variation (alternative line)
 */
function processVariation(line: ChessLine): string {
  if (!line.moveSequence || line.moveSequence.length === 0) {
    return ""
  }

  let result = ""

  // Format the variation's moves with proper ellipsis notation
  result += formatMoveSequence(line.moveSequence, line.depth, true)

  // Handle transpositions - stop here if it's a transposition
  if (line.transposition) {
    return result
  }

  // Continue recursively with this variation's children
  if (line.children.length > 0) {
    const continuation = processLineRecursive(line)
    if (continuation) {
      result += ` ${continuation}`
    }
  }

  return result
}

/**
 * Formats a single move into PGN notation.
 */
function formatSingleMove(
  move: any,
  depth: number,
  isVariation: boolean = false,
): string {
  const isWhiteMove = depth % 2 === 0
  const moveNumber = Math.floor(depth / 2) + 1

  if (isWhiteMove) {
    return `${moveNumber}. ${move.san}`
  } else {
    if (isVariation) {
      return `${moveNumber}... ${move.san}`
    } else {
      return move.san
    }
  }
}

/**
 * Formats a sequence of moves into PGN notation.
 */
function formatMoveSequence(
  moveSequence: any[],
  startDepth: number,
  isVariation: boolean = false,
): string {
  let result = ""

  for (let i = 0; i < moveSequence.length; i++) {
    const move = moveSequence[i]
    const moveDepth = startDepth + i
    const isWhiteMove = moveDepth % 2 === 0
    const moveNumber = Math.floor(moveDepth / 2) + 1

    if (isWhiteMove) {
      result += `${moveNumber}. ${move.san}`
    } else {
      if (i === 0 && isVariation) {
        result += `${moveNumber}... ${move.san}`
      } else {
        result += ` ${move.san}`
      }
    }

    if (i < moveSequence.length - 1) {
      result += " "
    }
  }

  return result
}
