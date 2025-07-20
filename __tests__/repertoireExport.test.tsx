import { convertRepertoireToChessLine } from "@/features/chess/lines/utils/repertoireConverter"
import { exportRepertoireToPgn } from "@/features/chess/lines/utils/repertoireExport"
import { RepertoireTestFactory } from "@/features/tests/repertoireTestFactory"

function normalisePgn(pgn: string): string {
  return pgn
    .replace(/\r?\n/g, " ") // collapse newlines
    .replace(/\s{2,}/g, " ") // collapse multiple spaces
    .trim() // strip leading / trailing space
}

test("Full PGN matches for a linear repertoire", () => {
  // Arrange
  const repertoire = RepertoireTestFactory.createSimpleRepertoire()
  const { root: linesData, transpositionIndex } =
    convertRepertoireToChessLine(repertoire)
  const expectedPgn =
    '[Event "Chess Repertoire"] [Site "Chess Repertoire Companion"] [Date "2025.07.09"] [White "Repertoire Owner"] [Black "Opponent"] [RepertoireId "test-id"] [RepertoireName "Test Repertoire"] [RepertoireColor "White"] [FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq"] [SetUp "1"] [PositionCount "2"] 1. e4 e5 *'

  // Act
  const actual = exportRepertoireToPgn(linesData, repertoire, "2025.07.09")

  // Assert
  expect(normalisePgn(actual)).toBe(normalisePgn(expectedPgn))
})

test("Full PGN with variations is exact", () => {
  // Arrange
  const repertoire =
    RepertoireTestFactory.createTranspositionWithMultipleResponsesRepertoire()
  const { root: linesData } = convertRepertoireToChessLine(repertoire)

  const expectedPgn =
    '[Event "Chess Repertoire"] [Site "Chess Repertoire Companion"] [Date "2025.07.09"] [White "Repertoire Owner"] [Black "Opponent"] [RepertoireId "test-id"] [RepertoireName "Test Repertoire"] [RepertoireColor "White"] [FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq"] [SetUp "1"] [PositionCount "8"] 1. d4 d5 (1... e5 2. e4 d5) 2. e4 e5 3. g3 Nc6 (3... Nf6) *'

  // Act
  const actual = exportRepertoireToPgn(linesData, repertoire, "2025.07.09")

  // Assert
  expect(normalisePgn(actual)).toBe(normalisePgn(expectedPgn))
})

test("Full PGN including transposition markers", () => {
  // Arrange
  const repertoire = RepertoireTestFactory.createSimpleTranspositionRepertoire()
  const { root: linesData } = convertRepertoireToChessLine(repertoire)

  const expectedPgn =
    '[Event "Chess Repertoire"] [Site "Chess Repertoire Companion"] [Date "2025.07.09"] [White "Repertoire Owner"] [Black "Opponent"] [RepertoireId "test-id"] [RepertoireName "Test Repertoire"] [RepertoireColor "White"] [FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq"] [SetUp "1"] [PositionCount "6"] 1. d4 d5 (1... e5 2. e4 d5) 2. e4 e5 *'

  // Act
  const actual = exportRepertoireToPgn(linesData, repertoire, "2025.07.09")

  // Assert
  expect(normalisePgn(actual)).toBe(normalisePgn(expectedPgn))
})

test("Export repertoire with multiple responses and transpositions", () => {
  // Arrange
  const repertoire =
    RepertoireTestFactory.createTranspositionWithMultipleResponsesRepertoire()
  const { root: linesData } = convertRepertoireToChessLine(repertoire)

  const expectedPgn =
    '[Event "Chess Repertoire"] [Site "Chess Repertoire Companion"] [Date "2025.07.09"] [White "Repertoire Owner"] [Black "Opponent"] [RepertoireId "test-id"] [RepertoireName "Test Repertoire"] [RepertoireColor "White"] [FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq"] [SetUp "1"] [PositionCount "8"] 1. d4 d5 (1... e5 2. e4 d5) 2. e4 e5 3. g3 Nc6 (3... Nf6) *'

  // Act
  const actual = exportRepertoireToPgn(linesData, repertoire, "2025.07.09")

  // Assert
  expect(normalisePgn(actual)).toBe(normalisePgn(expectedPgn))
})

test("Export complex multi-level transposition with cascading variations", async () => {
  // Arrange
  const repertoire =
    await RepertoireTestFactory.createComplexMultiLevelTranspositionRepertoire()
  const { root: linesData } = convertRepertoireToChessLine(repertoire)

  const expectedPgn =
    '[Event "Chess Repertoire"] [Site "Chess Repertoire Companion"] [Date "2025.07.09"] [White "Repertoire Owner"] [Black "Opponent"] [RepertoireId "test-id"] [RepertoireName "Multi-level Transposition Repertoire"] [RepertoireColor "White"] [FEN "fen-start"] [SetUp "1"] [PositionCount "17"] 1. a3 a6 (1... h6 2. h3 Nf6 3. Nf3 Nc6 4. Nc3 a6) (1... Nf6 2. h3 h6) 2. Nc3 Nc6 3. h3 h6 4. Nf3 Nf6 *'

  // Act
  const actual = exportRepertoireToPgn(linesData, repertoire, "2025.07.09")

  // Assert
  expect(normalisePgn(actual)).toBe(normalisePgn(expectedPgn))
})
