// moveUtils.ts

import { sanitizeFen } from "@/features/common/utils/utils"
import { ChessMove } from "@/types/ChessMove"

/**
 * Gets the last move in the chess game history.
 * @param depth The depth of the move to get, defaults to 1.
 * @returns The last move in the chess game history.
 */
export function getLastMove(chess: any, depth = 1) {
  const h = chess.history({ verbose: true })
  if (h.length - depth < 0) {
    return null
  }
  return h[h.length - depth]
}

export function getNextMove(repertoire: any, chess: any): ChessMove {
  let currentPos = repertoire.current.positions.get(sanitizeFen(chess.fen()))
  if (!currentPos) {
    return null
  }
  if (currentPos.moves.size > 0) {
    return currentPos.moves.values().next().value
  }
  return null
}

export function isPromotionMove(dest: string, piece: any): boolean {
  return (dest.endsWith("8") || dest.endsWith("1")) && piece?.type === "p"
}
