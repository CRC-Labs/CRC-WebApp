import { findMoveIndex, findCurrentLine } from "../src/features/chess/lines/utils/lineNavigation"
import { createTestMove } from "../src/features/tests/repertoireTestFactory"
import { ChessLine } from "../src/types/ChessLine"


describe("Line Navigation", () => {
  describe("findMoveIndex", () => {
    test("returns correct index of move by FEN", () => {
      const line = new ChessLine("1. e4 e5", "1. e4 e5", [
        createTestMove("e2", "e4", "e4", "fen-after-e4"),
        createTestMove("e7", "e5", "e5", "fen-after-e4-e5", "b"),
      ], [], 0)
      
      expect(findMoveIndex(line, "fen-after-e4")).toBe(0)
      expect(findMoveIndex(line, "fen-after-e4-e5")).toBe(1)
      expect(findMoveIndex(line, "unknown-fen")).toBe(-1)
    })
    
    test("returns -1 for empty move sequence", () => {
      const line = new ChessLine("", "", [], [], 0)
      expect(findMoveIndex(line, "any-fen")).toBe(-1)
    })
  })

  describe("findCurrentLine", () => {
    test("returns null for null parent", () => {
      expect(findCurrentLine(null, "1. e4", "fen")).toBeNull()
    })
    
    test("finds line with exact PGN match", () => {
      const rootLine = new ChessLine("", "", [], [], 0)
      const childLine = new ChessLine(
        "1. e4",
        "1. e4",
        [createTestMove("e2", "e4", "e4", "fen-after-e4")],
        [],
        0,
      )
      rootLine.children.push(childLine)

      const result = findCurrentLine(rootLine, "1. e4", "fen-after-e4")
      expect(result).not.toBeNull()
      expect(result.currentLine).toBe(childLine)
      expect(result.parentLine).toBe(rootLine)
      expect(result.lmIndex).toBe(0)
    })

    test("finds nested lines through recursive search", () => {
      const rootLine = new ChessLine("", "", [], [], 0)
      const level1Line = new ChessLine(
        "1. e4",
        "1. e4",
        [createTestMove("e2", "e4", "e4", "fen-after-e4")],
        [],
        0,
      )
      const level2Line = new ChessLine(
        "1. e4 e5",
        "1. e4 e5",
        [createTestMove("e7", "e5", "e5", "fen-after-e4-e5", "b")],
        [],
        1,
      )
      rootLine.children.push(level1Line)
      level1Line.children.push(level2Line)

      const result = findCurrentLine(rootLine, "1. e4 e5", "fen-after-e4-e5")
      expect(result).not.toBeNull()
      expect(result.currentLine).toBe(level2Line)
      expect(result.parentLine).toBe(level1Line)
      expect(result.lmIndex).toBe(0)
    })
    
    test("finds line with partial PGN match", () => {
      const rootLine = new ChessLine("", "", [], [], 0)
      const childLine = new ChessLine(
        "1. e4 e5 2. Nf3",
        "1. e4 e5 2. Nf3",
        [
          createTestMove("e2", "e4", "e4", "fen-after-e4"),
          createTestMove("e7", "e5", "e5", "fen-after-e4-e5", "b"),
          createTestMove("g1", "f3", "Nf3", "fen-after-e4-e5-Nf3"),
        ],
        [],
        0,
      )
      rootLine.children.push(childLine)

      const result = findCurrentLine(rootLine, "1. e4 e5", "fen-after-e4-e5")
      expect(result).not.toBeNull()
      expect(result.currentLine).toBe(childLine)
      expect(result.parentLine).toBe(rootLine)
      expect(result.lmIndex).toBe(1)
    })

    test("findCurrentLine correctly handles transpositions", () => {
        // Create a test tree with transpositions
        const rootLine = new ChessLine("", "", [], [], 0)
        const line1 = new ChessLine(
          "1. d4 e5 2. e4 d5",
          "1. d4 e5 2. e4 d5",
          [
            createTestMove("d2", "d4", "d4", "fen-after-d4"),
            createTestMove("e7", "e5", "e5", "fen-after-d4-e5", "b"),
            createTestMove("e2", "e4", "e4", "fen-after-d4-e5-e4"),
            createTestMove("d7", "d5", "d5", "fen-transposition", "b"),
          ],
          [],
          0,
        )
    
        const line2 = new ChessLine(
          "1. d4 d5 2. e4 e5",
          "1. d4 d5 2. e4 e5",
          [
            createTestMove("d2", "d4", "d4", "fen-after-d4"),
            createTestMove("d7", "d5", "d5", "fen-after-d4-d5", "b"),
            createTestMove("e2", "e4", "e4", "fen-after-d4-d5-e4"),
            createTestMove("e7", "e5", "e5", "fen-transposition", "b"),
          ],
          [],
          0,
        )
    
        rootLine.children.push(line1)
        rootLine.children.push(line2)
    
        // Test with first line
        const result1 = findCurrentLine(
          rootLine,
          "1. d4 e5 2. e4 d5",
          "fen-transposition",
        )
        expect(result1).not.toBeNull()
        expect(result1.currentLine).toBe(line1)
        expect(result1.lmIndex).toBe(3) // Index of d5 move
    
        // Test with second line
        const result2 = findCurrentLine(
          rootLine,
          "1. d4 d5 2. e4 e5",
          "fen-transposition",
        )
        expect(result2).not.toBeNull()
        expect(result2.currentLine).toBe(line2)
        expect(result2.lmIndex).toBe(3) // Index of e5 move
      })
  })
})
