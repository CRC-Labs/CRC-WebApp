import { appendMovesToSequenceAndUpdatePgn } from "../src/features/chess/lines/utils/moveHandlersHelpers"
import { createTestMove } from "../src/features/tests/repertoireTestFactory"
import { ChessLine } from "../src/types/ChessLine"

describe("addMoveToLine and associated functions", () => {
  // Existing tests for addMoveToLine
  describe("addMovesToSequenceAndUpdatePgn", () => {
    test("Adds a move and correctly updates an existing line", () => {
      const line = new ChessLine("1. e4", "1. e4", [], [], 0)
      line.moveSequence.push(createTestMove("e2", "e4", "e4", "fen-after-e4"))
      const move = createTestMove("e7", "e5", "e5", "fen-after-e4-e5", "b")
      appendMovesToSequenceAndUpdatePgn([move], line)
      expect(line.pgn).toBe("1. e4 e5")
      expect(line.id).toBe("1. e4 e5")
      expect(line.depth).toBe(0)
      expect(line.moveSequence.length).toBe(2)
    })
  })
})
