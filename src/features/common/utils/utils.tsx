import { JSX, useEffect, useState } from "react"

import { ChessInstance } from "chess.js"
import { Api } from "chessground/api"
import { Color, Key } from "chessground/types"

/**
 * Converts the possible moves of a chess instance to a map of destinations.
 * The `toDests` function takes a chess instance and returns a map of destinations.
 * The function gets the possible moves of the chess instance and creates a map of destinations for each move.
 * The map is keyed by the starting square of the move and the value is an array of possible destination squares.
 * @param chess The chess instance.
 * @returns The map of destinations.
 */
export function toDests(chess: ChessInstance): Map<Key, Key[]> {
  const dests = new Map()
  let moves = chess.moves({ verbose: true })
  moves.forEach((move) => {
    let d: Key[] = dests.get(move.from)
    if (!d) {
      d = []
    }
    d.push(move.to)
    dests.set(move.from, d)
  })
  return dests
}

/**
 * Converts the current turn of a chess instance to a color.
 * The `toColor` function takes a chess instance and returns the color of the current turn as a string.
 * If the current turn is "w", the function returns "white". Otherwise, the function returns "black".
 * @param chess The chess instance.
 * @returns The color of the current turn.
 */
export function toColor(chess: any): Color {
  return chess.turn() === "w" ? "white" : "black"
}

/**
 * Plays a move on the opposite side of the current turn.
 * The `playOtherSide` function takes a chessground instance and a chess instance and returns a function that plays a move on the opposite side of the current turn.
 * The function takes a starting square and an ending square and moves the chess piece accordingly.
 * The function then updates the chessground instance with the new turn color, check status, and movable squares.
 * @param cg The chessground instance.
 * @param chess The chess instance.
 * @returns The function that plays a move on the opposite side of the current turn.
 */
export function playOtherSide(cg: Api, chess) {
  return (orig, dest) => {
    chess.move({ from: orig, to: dest })
    cg.set({
      turnColor: toColor(chess),
      check: chess.in_check(),
      movable: {
        color: toColor(chess),
        dests: toDests(chess),
      },
    })
  }
}

/**
 * Plays a move for the AI player.
 * The `aiPlay` function takes a chessground instance, a chess instance, a delay, and a boolean indicating whether it is the first move and returns a function that plays a move for the AI player.
 * The function takes a starting square and an ending square and moves the chess piece accordingly.
 * The function then waits for the specified delay and selects a move for the AI player.
 * If it is the first move, the function selects the first move in the list of possible moves.
 * Otherwise, the function selects a random move from the list of possible moves.
 * The function then moves the chess piece and updates the chessground instance with the new turn color and movable squares.
 * The function also plays the premove on the chessground instance.
 * @param cg The chessground instance.
 * @param chess The chess instance.
 * @param delay The delay in milliseconds.
 * @param firstMove A boolean indicating whether it is the first move.
 * @returns The function that plays a move for the AI player.
 */
export function aiPlay(cg: Api, chess, delay: number, firstMove: boolean) {
  return (orig, dest) => {
    chess.move({ from: orig, to: dest })
    setTimeout(() => {
      const moves = chess.moves({ verbose: true })
      const move = firstMove
        ? moves[0]
        : moves[Math.floor(Math.random() * moves.length)]
      chess.move(move.san)
      cg.move(move.from, move.to)
      cg.set({
        turnColor: toColor(chess),
        movable: {
          color: toColor(chess),
          dests: toDests(chess),
        },
      })
      cg.playPremove()
    }, delay)
  }
}

/**
 * Gets the file path for the image of a chess piece.
 * The `getPieceImagePathFromSan` function takes a SAN string and a color and returns the file path for the image of the corresponding chess piece.
 * If the SAN string is not a castling move and the first character is uppercase, the function returns the file path for the image of the corresponding chess piece.
 * Otherwise, the function returns `null`.
 * @param san The SAN string.
 * @param color The color of the chess piece.
 * @returns The file path for the image of the corresponding chess piece or `null`.
 */
export function getPieceImagePathFromSan(
  san: string,
  color: string,
): string | null {
  if (san !== "O-O" && san !== "O-O-O" && firstIsUppercase(san)) {
    return "chessPieces/" + color + "_" + san[0] + ".svg"
  } else {
    return null
  }
}

/**
 * Checks if the first character of a string is uppercase.
 * The `firstIsUppercase` function takes a string and returns a boolean indicating whether the first character is uppercase.
 * If the string is not a string or is empty, the function returns `false`.
 * Otherwise, the function checks if the first character is uppercase and returns the result.
 * @param str The string.
 * @returns A boolean indicating whether the first character is uppercase.
 */
export function firstIsUppercase(str: string): boolean {
  if (typeof str !== "string" || str.length === 0) {
    return false
  }

  if (str[0].toUpperCase() === str[0]) {
    return true
  }

  return false
}

/**
 * Returns a component indicating which color is to play.
 * The `whoIsToPlayComponent` function takes a color and returns a React component indicating which color is to play.
 * If the color is "white" or starts with "w", the function returns a component indicating that white is to play.
 * Otherwise, the function returns a component indicating that black is to play.
 * @param color The color of the player to play.
 * @returns A React component indicating which color is to play.
 */
export function whoIsToPlayComponent(color: Color): JSX.Element {
  if (color[0] === "w") {
    return (
      <div className="flex flex-col items-center justify-center text-center text-(0.75rem) text-gray-600 dark:text-gray-400">
        <div className="h-4 w-4 rounded-full border-2 border-gray-400 bg-white" />
        <span>White to play</span>
      </div>
    )
  } else if (color[0] === "b") {
    return (
      <div className="flex flex-col items-center justify-center text-center text-(0.75rem) text-gray-600 dark:text-gray-400">
        <div className="h-4 w-4 rounded-full border-2 border-white bg-black" />
        <span>Black to play</span>
      </div>
    )
  }
}

export function sanitizeFen(fen: string): string {
  // Check if the FEN is a test FEN (doesn't contain spaces)
  if (!fen.includes(" ")) {
    return fen // Return the test FEN unchanged
  }

  // For standard FEN strings, keep only the first three parts
  const fenParts = fen.split(" ")
  if (fenParts.length === 3) return fen //Already sanitized
  return fenParts.slice(0, 3).join(" ")
}
