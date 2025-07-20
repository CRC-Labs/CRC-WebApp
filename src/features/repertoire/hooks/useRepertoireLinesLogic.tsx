import { useRepertoireProvider } from "@/features/repertoire/providers/RepertoireProvider"

import { convertRepertoireToChessLine } from "@/features/chess/lines/utils/repertoireConverter"
import { ChessLine } from "@models/ChessLine"
import { ChessMove } from "@models/ChessMove"
import { useAppContext } from "@/features/context/providers/AppContextProvider"

// hooks/repertoire/useRepertoireLines.ts
export function useRepertoireLinesLogic() {
  const { repertoire, linesData, setLinesData, transpositionIndex } =
    useRepertoireProvider()
  const { openings } = useAppContext() // Accessing openings data from the AppContextProvider.

  /**
   * Calcule les lignes du répertoire d'échecs
   * @param maxDepth La profondeur maximale pour le calcul des lignes (par défaut: 50)
   * @returns La ligne racine calculée
   */
  function computeLines(maxDepth = 50): ChessLine {
    // Créer une ligne racine vide
    const rootLine = new ChessLine(
      "",
      "",
      new Array<ChessMove>(),
      new Array<ChessLine>(),
      0,
    )

    let { root, transpositionIndex: index } = convertRepertoireToChessLine(
      repertoire.current,
      openings,
    )
    transpositionIndex.current = index
    // Mettre à jour les données des lignes
    setLinesData(root)

    return root
  }

  // In useRepertoireLinesLogic.js - Add these functions

  /**
   * Checks if a position (PGN) exists in the current lines data
   */
  function positionExistsInLines(
    linesData: ChessLine,
    targetPgn: string,
  ): boolean {
    if (!linesData || !targetPgn) return false

    // Check if this is the target line
    if (linesData.pgn === targetPgn) {
      return true
    }

    // Recursively check children
    for (const child of linesData.children) {
      if (positionExistsInLines(child, targetPgn)) {
        return true
      }
    }

    return false
  }

  /**
   * Finds the closest valid ancestor position by trimming moves from PGN
   */
  function findFallbackPosition(
    linesData: ChessLine,
    targetPgn: string,
  ): string {
    // If current position exists, return it
    if (positionExistsInLines(linesData, targetPgn)) {
      return targetPgn
    }

    // Try to find closest ancestor by trimming PGN
    const parts = targetPgn.trim().split(/\s+/)

    while (parts.length > 0) {
      parts.pop() // Remove last move
      const candidatePgn = parts.join(" ")

      if (positionExistsInLines(linesData, candidatePgn)) {
        return candidatePgn
      }
    }

    // If no ancestor found, return root (empty PGN)
    return ""
  }

  /**
   * Validates and updates the current board position after repertoire changes
   */
  function validateAndUpdatePosition(
    currentPgn: string,
    newLinesData: ChessLine,
  ): string {
    // Check if current position still exists
    if (positionExistsInLines(newLinesData, currentPgn)) {
      return currentPgn
    }

    // Find fallback position
    const fallbackPgn = findFallbackPosition(newLinesData, currentPgn)

    return fallbackPgn
  }

  return {
    linesData,
    computeLines,
    positionExistsInLines,
    findFallbackPosition,
    validateAndUpdatePosition,
  }
}
