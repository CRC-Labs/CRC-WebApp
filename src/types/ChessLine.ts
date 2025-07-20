import { ChessMove } from "./ChessMove"

/**
 * Represents a chess line.
 * The `ChessLine` class defines the properties of a chess line.
 * Each line has an ID, a PGN string, a move sequence, an array of child lines, an opening name, a depth, a flag indicating whether the line needs to be updated, and a flag indicating whether the line is unfinished.
 */
export class ChessLine {
  id: string // The ID of the line.
  pgn: string // The PGN string of the line.
  moveSequence: ChessMove[] // The move sequence of the line.
  children: ChessLine[] // The child lines of the line.
  opening: string // The opening name of the line.
  depth: number // The depth of the line.
  flags: ChessLineFlag
  unfinished: boolean // A flag indicating whether the line is unfinished.
  transposition: TranspositionElement

  /**
   * Creates a new instance of the `ChessLine` class.
   * @param id The ID of the line.
   * @param pgn The PGN string of the line.
   * @param moveSequence The move sequence of the line.
   * @param children The child lines of the line.
   * @param depth The depth of the line.
   */
  constructor(
    id: string,
    pgn: string,
    moveSequence: ChessMove[],
    children: ChessLine[],
    depth: number,
  ) {
    this.id = id
    this.pgn = pgn
    this.moveSequence = moveSequence
    this.children = children
    this.depth = depth
    this.flags = { toBeUpdated: false, isShared: false }
    this.unfinished = false
  }
}

interface ChessLineFlag {
  toBeUpdated: boolean // A flag indicating whether the line needs to be updated.
  isShared: boolean
}

export interface TranspositionElement {
  line: ChessLine
  moveIndex: number
  usedIn: TranspositionReference[]
}

export interface TranspositionReference {
  moveIndex: number
  line: ChessLine
}

export interface CurrentLineData {
  currentLine: ChessLine // The current line of the repertoire
  parentLine: ChessLine // The parent line of the current line
  lmIndex: number // The index of the last move in the current line
}
