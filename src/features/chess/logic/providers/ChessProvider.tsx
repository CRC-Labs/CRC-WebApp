/**
 * @file ChessProvider.tsx
 * @description This file defines the ChessProvider component, responsible for managing the
 * chess game state and providing utility functions related to chess gameplay. It utilizes
 * the Chess.js library to handle chess logic and move generation. The context provided by this
 * component includes functions to get the current chess configuration, determine the opening
 * name based on the game state, and manage game moves.
 *
 * @summary Chess Game State Management and Utility Functions.
 *
 * @remarks The ChessProvider component manages the chess game state, allowing child components
 * to access the current configuration, highlight legal moves, and handle game-related operations.
 * It also includes functions to retrieve the opening name based on the game state, ensuring
 * accurate tracking of the opening played. The provided context is utilized to enhance the chess
 * playing experience and provide interactive chess gameplay within the application.
 *
 * @see {@link https://github.com/jhlywa/chess.js} for the Chess.js library documentation.
 *
 * @exports ChessProvider - The context provider component for chess gameplay.
 * @exports useChessProvider - A custom hook to access the chess game state and utility functions.
 *
 * @section Exported Values
 * - `ChessProvider`: The context provider component managing the chess game state and utility functions.
 * - `useChessProvider()`: A custom hook to access the chess game state and utility functions.
 *
 * @version 0.2.1
 * @date April 30, 2023
 * @author [Jérémy Guillemot]
 */
import React, { useRef, useState } from "react"

import { Chess } from "chess.js"

import { sanitizeFen, toColor, toDests } from "@/features/common/utils/utils"

import { useAppContext } from "../../../context/providers/AppContextProvider"
import { findOpeningNameForPgn } from "../utils/openingsUtils"

// Interface defining the structure of the context provided by ChessProvider.
interface ChessContextInterface {
  chess: any // Instance of the Chess.js library representing the chess game.
  getConfigFromChess: Function // Function to get the chess configuration for rendering.
  getOpeningName: Function // Function to determine the opening name based on the game state.
  getFen: Function
  getTurnNumberFromChessHistory: Function
}

// Create a new context for the chess game state and utility functions.
const Context = React.createContext<ChessContextInterface | null>(null)

/**
 * ChessProvider component manages the chess game state and provides utility functions for chess gameplay.
 * @component
 */
export default function ChessProvider({ children }) {
  // State to hold the chess game instance using the Chess.js library.
  const [chess] = useState(new Chess())
  const { openings } = useAppContext() // Accessing openings data from the AppContextProvider.

  // Reference to store the previous opening name for memory purposes.
  const prevOpeningName = useRef<string | undefined>(undefined)

  function getTurnNumberFromChessHistory() {
    let len = chess.history().length
    if (len % 2 === 0) {
      return len / 2 + 1
    } else {
      return Math.ceil(len / 2)
    }
  }

  /**
   * Function to determine the opening name based on the given PGN (Portable Game Notation) string.
   * @param {string} pgn - PGN string representing the current game state.
   * @param {boolean} memory - Indicates whether to use memory for opening name retrieval.
   * @returns {string | undefined} - Opening name corresponding to the given PGN or undefined if not found.
   */
  function getOpeningName(pgn = chess.pgn()) {
    return findOpeningNameForPgn(pgn, openings)
  }

  /**
   * Function to generate the configuration object required for rendering the chessboard.
   * @param {boolean} removeDrawable - Indicates whether to remove drawable shapes from the board.
   * @param {boolean} viewOnly - Indicates whether the chessboard is in view-only mode.
   * @param {object} oldDrawable - Previous drawable shapes configuration (if available).
   * @returns {object} - Configuration object for rendering the chessboard.
   */
  function getConfigFromChess(
    removeDrawable = false,
    viewOnly = false,
    oldDrawable,
  ) {
    let h = chess.history({ verbose: true })
    let lastMove = []
    if (h.length > 0) {
      lastMove = [h[h.length - 1].from, h[h.length - 1].to]
    }

    // Configuration object for rendering the chessboard.
    let cfg = {
      fen: chess.fen(), // Current FEN (Forsyth-Edwards Notation) position of the chessboard.
      highlight: {
        check: true, // Highlight squares under check.
      },
      turnColor: toColor(chess), // Color of the current turn (white or black).
      check: chess.in_check(), // Indicates if the current player is in check.
      lastMove: lastMove, // Last move played on the board [from, to].
      movable: {
        dests: toDests(chess), // Legal moves for the current position.
        color: toColor(chess), // Color of the pieces that can be moved.
        free: false, // Pieces are not freely movable (standard chess rules).
      },
      draggable: {
        showGhost: true, // Display a ghost image of the piece being dragged.
      },
    }

    // Additional configurations based on parameters.
    if (viewOnly) {
      cfg["viewOnly"] = true // Chessboard is in view-only mode.
    } else {
      cfg["viewOnly"] = false // Chessboard allows user interaction.
    }

    if (removeDrawable === true) {
      cfg["drawable"] = {
        autoShapes: [], // Remove drawable shapes from the board.
      }
    } else if (oldDrawable) {
      cfg["drawable"] = oldDrawable // Use previous drawable shapes configuration.
    }

    return cfg // Return the chessboard configuration object.
  }

  function getFen() {
    return sanitizeFen(chess.fen())
  }

  // Provide the chess game state and utility functions through the context.
  return (
    <Context.Provider
      value={{
        getConfigFromChess,
        getOpeningName,
        chess,
        getFen,
        getTurnNumberFromChessHistory,
      }}
    >
      {children}
    </Context.Provider>
  )
}

/**
 * Custom hook to access the chess game state and utility functions provided by ChessProvider.
 * @returns {ChessContextInterface} - Object containing chess game state and utility functions.
 */
export function useChessProvider() {
  return React.useContext(Context) // Use React context to access the provided chess context.
}
