/**
 * Represents a chess move.
 * The `ChessMove` interface defines the properties of a chess move.
 * Each move has a color, a starting square, an ending square, optional flags, optional piece, optional SAN, optional next FEN, optional captured piece, and optional promotion piece.
 */
export interface ChessMove {
  color?: string // The color of the piece making the move.
  from: string // The starting square of the move.
  to: string // The ending square of the move.
  flags?: string // Optional flags for the move.
  piece?: string // Optional piece for the move.
  san?: string // Optional SAN for the move.
  nextFen?: string // Optional next FEN for the move.
  captured?: string // Optional captured piece for the move.
  promotion?: string // Optional promotion piece for the move.
}