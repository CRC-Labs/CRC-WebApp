import { ChessMove } from "./ChessMove"

/**
 * Represents a node in the sunburst chart.
 * The `SunburstNode` interface defines the properties of a node in the sunburst chart.
 * Each node has a FEN string, a chess move, an optional value, and an optional array of child nodes.
 */
export interface SunburstNode {
    fen: string // The FEN string for the node.
    move: ChessMove // The chess move for the node.
    value?: number // An optional value for the node.
    children?: SunburstNode[] // An optional array of child nodes for the node.
  }