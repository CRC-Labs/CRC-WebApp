import { ChessLine } from "../../../../types/ChessLine"
import { ChessMove } from "../../../../types/ChessMove"

/**
 * Determines the appropriate separator to use between chess moves in PGN notation.
 * 
 * This function calculates the correct separator based on the move's depth in the game
 * and whether it's a white move (which includes move numbering) or a black move.
 * 
 * Examples:
 * - White moves typically have numbering: "1. e4"
 * - Black moves typically do not: "1. e4 e5"
 *
 * @param depth - The current depth of the move in the tree
 * @param parentId - The identifier of the parent line
 * @returns The separator to use before the current move
 */
export function determineMoveSeparator(
  depth: number,
  parentId: string,
): string {
  // For odd depths (black's moves), use a simple space
  // For even depths (white's moves), include move numbering
  let separator = depth % 2 === 1 ? " " : " " + (depth / 2 + 1) + ". "

  // Special case: if this is the first move in a line, remove the leading space
  if (parentId === "") {
    separator = separator.substring(1)
  }

  return separator
}

/**
 * Computes a PGN string from a sequence of chess moves.
 * 
 * This function takes an array of ChessMove objects and converts them into
 * a properly formatted PGN string with correct move numbering and spacing.
 * The function respects the initial depth parameter to properly number moves.
 *
 * @param moveSequence - Array of ChessMove objects to convert
 * @param depth - The starting depth of the sequence in the move tree
 * @returns A properly formatted PGN string representing the move sequence
 */
export function computePgnFromMoveSequence(
  moveSequence: ChessMove[],
  depth: number,
): string {
  // Return empty string for empty sequences
  if (!moveSequence || moveSequence.length === 0) {
    return ""
  }

  let pgn = ""

  // Iterate through all moves in the sequence
  for (let i = 0; i < moveSequence.length; i++) {
    const move = moveSequence[i]

    // Calculate the current depth for this move
    const moveDepth = depth + i

    // Determine the appropriate separator based on depth and position in sequence
    const separator = determineMoveSeparator(moveDepth, i === 0 ? "" : pgn)

    // Add the move to the PGN string
    pgn += separator + move.san
  }

  return pgn
}

/**
 * Calcule le PGN d'une ligne jusqu'à un index de coup spécifique,
 * en préservant les coups des lignes parentes et en tronquant la fin.
 */
export function getLinePgnUpToIndex(line: ChessLine, moveIndex: number): string {
  if (!line || moveIndex < 0) return "";
  
  // Si le moveIndex dépasse la longueur de la séquence, utiliser toute la séquence
  const effectiveIndex = Math.min(moveIndex, line.moveSequence.length - 1);
  
  if (effectiveIndex < 0) return "";
  
  // Si on demande le PGN complet, retourner simplement le PGN de la ligne
  if (effectiveIndex >= line.moveSequence.length - 1) {
    return line.pgn;
  }
  
  // Pour tronquer correctement, nous devons compter les coups dans le PGN
  // Nous utilisons la profondeur pour déterminer combien de coups sont hérités des parents
  const parentMovesCount = line.depth;
  const totalMoveCount = parentMovesCount + effectiveIndex + 1;
  
  // Diviser le PGN en éléments (numéros de coups et coups)
  const pgnElements = line.pgn.split(/\s+/);
  
  // Compter les éléments jusqu'au coup effectif
  // Chaque coup complet a 3 éléments: numéro, coup blanc, coup noir
  // Un coup incomplet peut avoir 2 éléments: numéro et coup blanc
  let elementsToKeep = 0;
  let movesProcessed = 0;
  
  for (let i = 0; i < pgnElements.length; i++) {
    // Si nous avons un numéro de coup (comme "1." ou "5...")
    if (pgnElements[i].match(/^\d+\.\.?\.?$/)) {
      // Si nous avons atteint le nombre de coups souhaité, arrêter
      if (movesProcessed >= totalMoveCount) {
        break;
      }
    } 
    // Sinon c'est un coup (comme "e4" ou "Nf6")
    else {
      movesProcessed++;
      // Si nous avons atteint le nombre de coups souhaité, inclure ce coup et arrêter
      if (movesProcessed >= totalMoveCount) {
        elementsToKeep = i + 1;
        break;
      }
    }
    elementsToKeep = i + 1;
  }
  
  // Retourner le PGN tronqué
  return pgnElements.slice(0, elementsToKeep).join(" ");
}
