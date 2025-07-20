import { handleTransposition } from "../src/features/chess/lines/utils/repertoireConverter"
import {
  createTestMove,
  RepertoireTestFactory,
} from "../src/features/tests/repertoireTestFactory"
import { TranspositionElement, ChessLine } from "../src/types/ChessLine"
import { ChessPosition } from "../src/types/ChessPosition"

describe("Line Utilities", () => {
  describe("handleTransposition", () => {
    test("adds a new line to existing transposition with usedIn", () => {
      // Setup transposition index and elements
      const transpositionIndex = new Map<string, TranspositionElement>()
      const sharedLine = new ChessLine(
        "1. d4 d5 2. e4 e5",
        "1. d4 d5 2. e4 e5",
        [],
        [],
        0,
      )
      sharedLine.flags.isShared = true

      const existingLine = new ChessLine(
        "1. e4 e5 2. d4 d5",
        "1. e4 e5 2. d4 d5",
        [],
        [],
        0,
      )

      const transpositionElement: TranspositionElement = {
        line: sharedLine,
        moveIndex: 3,
        usedIn: [
          {
            line: existingLine,
            moveIndex: 3,
          },
        ],
      }

      const newLine = new ChessLine(
        "1. Nf3 d5 2. d4 e5",
        "1. Nf3 d5 2. d4 e5",
        [],
        [],
        0,
      )

      // Act
      handleTransposition(
        transpositionIndex,
        transpositionElement,
        newLine,
        "fen-transposition",
      )

      // Assert
      expect(transpositionElement.usedIn.length).toBe(2)
      expect(
        transpositionElement.usedIn.some((ref) => ref.line === newLine),
      ).toBeTruthy()
      expect(newLine.transposition).toBe(transpositionElement)
    })

    test("initializes usedIn for first transposition reference", () => {
      // Setup
      const transpositionIndex = new Map<string, TranspositionElement>()
      const sharedLine = new ChessLine("1. d4 d5", "1. d4 d5", [], [], 0)

      const transpositionElement: TranspositionElement = {
        line: sharedLine,
        moveIndex: 1,
        usedIn: undefined,
      }

      const newLine = new ChessLine("1. c4 d5", "1. c4 d5", [], [], 0)

      // Act
      handleTransposition(
        transpositionIndex,
        transpositionElement,
        newLine,
        "fen-d5",
      )

      // Assert
      expect(transpositionElement.usedIn).toBeDefined()
      expect(transpositionElement.usedIn.length).toBe(1)
      expect(
        transpositionElement.usedIn.some((ref) => ref.line === newLine),
      ).toBeTruthy()
      expect(newLine.transposition).toBe(transpositionElement)
      expect(sharedLine.flags.isShared).toBeTruthy()
    })

    test("correctly handles cyclic references", () => {
      // Arrange
      const transpositionIndex = new Map<string, TranspositionElement>()
      const sharedLine = new ChessLine(
        "1. g3",
        "1. g3",
        [createTestMove("g2", "g3", "g3", "fen-after-g3")],
        [],
        0,
      )
      sharedLine.flags.isShared = true

      const transpositionElement: TranspositionElement = {
        line: sharedLine,
        moveIndex: 0,
        usedIn: [
          {
            moveIndex: 2,
            line: new ChessLine(
              "1. d4 d5 2. e4",
              "1. d4 d5 2. e4",
              [
                createTestMove("d2", "d4", "d4", "fen-after-d4"),
                createTestMove("d7", "d5", "d5", "fen-after-d4-d5", "b"),
                createTestMove("e2", "e4", "e4", "fen-transposition"),
              ],
              [],
              2,
            ),
          },
        ],
      }

      // Simulate a cyclic reference: the move in the shared line leads to the transposition position
      sharedLine.moveSequence[0].nextFen = "fen-transposition"
      transpositionIndex.set("fen-transposition", transpositionElement)

      // Act
      // Try to add a new line that transposes to this position
      const newLine = new ChessLine(
        "1. e4 d5 2. d4",
        "1. e4 d5 2. d4",
        [
          createTestMove("e2", "e4", "e4", "fen-after-e4"),
          createTestMove("d7", "d5", "d5", "fen-after-e4-d5", "b"),
          createTestMove("d2", "d4", "d4", "fen-transposition"),
        ],
        [],
        2,
      )

      // Assert
      // Verify that handleTransposition correctly handles this situation without infinite loop
      expect(() => {
        handleTransposition(
          transpositionIndex,
          transpositionElement,
          newLine,
          "fen-transposition",
        )
      }).not.toThrow()

      // Verify that the new line was correctly added to the references
      expect(transpositionElement.usedIn.length).toBe(2)
      expect(
        transpositionElement.usedIn.some((ref) => ref.line === newLine),
      ).toBeTruthy()
    })
  })

  test("Managing cyclic references in transpositions", () => {
    // Arrange
    const transpositionIndex = new Map<string, TranspositionElement>()

    // Create a shared line
    const sharedLine = new ChessLine(
      "g3",
      "g3",
      [createTestMove("g2", "g3", "g3", "fen-after-g3")],
      [],
      0,
    )
    sharedLine.flags.isShared = true
    // Create a transposition element that references this shared line
    const transpositionElement: TranspositionElement = {
      line: sharedLine,
      moveIndex: 0,
      usedIn: [
        {
          moveIndex: 2,
          line: new ChessLine(
            "1. d4 d5 2. e4",
            "1. d4 d5 2. e4",
            [
              createTestMove("d2", "d4", "d4", "fen-after-d4"),
              createTestMove("d7", "d5", "d5", "fen-after-d4-d5", "b"),
              createTestMove("e2", "e4", "e4", "fen-transposition"),
            ],
            [],
            2,
          ),
        },
      ],
    }

    // Simulate a cyclic reference: the move in the shared line leads to the transposition position
    sharedLine.moveSequence[0].nextFen = "fen-transposition"
    transpositionIndex.set("fen-transposition", transpositionElement)

    // Act
    // Try to add a new line that transposes to this position
    const newLine = new ChessLine(
      "1. e4 d5 2. d4",
      "1. e4 d5 2. d4",
      [
        createTestMove("e2", "e4", "e4", "fen-after-e4"),
        createTestMove("d7", "d5", "d5", "fen-after-e4-d5", "b"),
        createTestMove("d2", "d4", "d4", "fen-transposition"),
      ],
      [],
      2,
    )

    // Assert
    // Verify that handleTransposition correctly handles this situation without infinite loop
    expect(() => {
      handleTransposition(
        transpositionIndex,
        transpositionElement,
        newLine,
        "fen-transposition",
      )
    }).not.toThrow()

    // Verify that the new line was correctly added to the references
    expect(transpositionElement.usedIn.length).toBe(2)
    expect(
      transpositionElement.usedIn.some((ref) => ref.line === newLine),
    ).toBeTruthy()
  })
})
