// utils/openingNameUtils.js

/**
 * Finds the opening name for a given PGN by checking progressively shorter PGN prefixes.
 * This handles the case where a line's PGN is longer than any opening in the database.
 * Properly handles PGN move number notation (1., 2., etc.)
 *
 * @param pgn - The PGN string to find opening for
 * @param openingsMap - Map of PGN strings to opening names
 * @returns The opening name or undefined if not found
 */
export function findOpeningNameForPgn(
  pgn: string,
  openingsMap: Map<string, string>,
): string | undefined {
  if (!pgn || !openingsMap) return undefined

  // First try exact match
  const exactMatch = openingsMap.get(pgn)
  if (exactMatch) return exactMatch

  // Extract individual moves from PGN, handling move numbers properly
  const moves = extractMovesFromPgn(pgn)

  // Work backwards from the full move sequence, removing moves one by one
  for (let i = moves.length; i > 0; i--) {
    const partialMoves = moves.slice(0, i)
    const partialPgn = reconstructPgnFromMoves(partialMoves)

    const openingName = openingsMap.get(partialPgn)
    if (openingName) {
      return openingName
    }
  }
  return undefined
}

/**
 * Extracts individual chess moves from a PGN string, removing move numbers.
 * Handles various PGN formats including move numbers like "1.", "2.", etc.
 *
 * @param pgn - The PGN string to parse
 * @returns Array of individual moves (e.g., ["e4", "d6", "d4", "Nf6"])
 */
function extractMovesFromPgn(pgn: string): string[] {
  if (!pgn) return []

  // Remove move numbers (digits followed by one or more periods and optional spaces)
  // This regex handles: "1.", "2.", "10.", "1...", etc.
  const pgnCleaned = pgn.replace(/\d+\.+\s*/g, "").trim()

  // Split by whitespace and filter out empty strings
  const moves = pgnCleaned.split(/\s+/).filter((move) => move.length > 0)

  return moves
}

/**
 * Reconstructs a PGN string from an array of moves, adding proper move numbers.
 * This ensures the reconstructed PGN matches the format expected by the openings map.
 *
 * @param moves - Array of individual moves
 * @returns Properly formatted PGN string
 */
function reconstructPgnFromMoves(moves: string[]): string {
  if (moves.length === 0) return ""

  let pgn = ""
  let moveNumber = 1

  for (let i = 0; i < moves.length; i++) {
    if (i % 2 === 0) {
      // White move - add move number
      pgn += `${moveNumber}. ${moves[i]}`
      if (i < moves.length - 1) pgn += " "
    } else {
      // Black move - just add the move
      pgn += `${moves[i]}`
      if (i < moves.length - 1) pgn += " "
      moveNumber++
    }
  }

  return pgn.trim()
}
