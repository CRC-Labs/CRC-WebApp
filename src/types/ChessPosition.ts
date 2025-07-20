import { ChessMove } from "./ChessMove"

/**
 * Represents a chess position.
 * The `ChessPosition` class defines the properties of a chess position.
 * Each position has an ID and a map of moves.
 */
export class ChessPosition {
  id: string // The ID of the position.
  moves: Map<string, ChessMove> = new Map<string, ChessMove>() // The map of moves for the position.

  /**
   * Creates a new instance of the `ChessPosition` class.
   * @param id The ID of the position.
   */
  constructor(id: string) {
    this.id = id
  }
}
