// __tests__/utils/repertoireTestFactory.ts

import { readRepertoiresFromJsonToIndex } from "@/features/common/utils/fsutils"
import { TranspositionElement } from "@models/ChessLine"
import { ChessMove } from "@models/ChessMove"
import { ChessPosition } from "@models/ChessPosition"
import { ChessRepertoire } from "@models/Repertoire"
import { sanitizeFen } from "@/features/common/utils/utils"

/**
 * Crée un coup d'échecs pour les tests
 */
export function createTestMove(
  from: string,
  to: string,
  san: string,
  nextFen: string,
  color: string = "w",
): ChessMove {
  return {
    from,
    to,
    san,
    nextFen,
    color,
  }
}

/**
 * Factory pour créer différents scénarios de test de répertoire
 */
export class RepertoireTestFactory {
  /**
   * Crée un répertoire vide
   */
  static createEmptyRepertoire(color: string = "w"): ChessRepertoire {
    const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq"
    return new ChessRepertoire("test-id", "Test Repertoire", color, startFen)
  }

  /**
   * Crée un répertoire avec une seule ligne simple
   * 1. e4 e5
   */
  static createSimpleRepertoire(): ChessRepertoire {
    const repertoire = this.createEmptyRepertoire()

    // Position initiale
    const startPos = new ChessPosition(repertoire.startingPosition)

    // Ajouter le coup 1. e4
    const moveE4 = createTestMove("e2", "e4", "e4", "fen-after-e4")
    startPos.moves.set("e4", moveE4)

    // Position après 1. e4
    const positionAfterE4 = new ChessPosition("fen-after-e4")

    // Ajouter le coup 1... e5
    const moveE5 = createTestMove("e7", "e5", "e5", "fen-after-e4-e5", "b")
    positionAfterE4.moves.set("e5", moveE5)

    // Enregistrer les positions dans le répertoire
    repertoire.positions.set(repertoire.startingPosition, startPos)
    repertoire.positions.set("fen-after-e4", positionAfterE4)

    return repertoire
  }

  /**
   * Crée un répertoire avec une transposition simple
   * Ligne 1: 1. d4 d5 2. e4 e5
   * Ligne 2: 1. d4 e5 2. e4 d5
   */
  static createSimpleTranspositionRepertoire(): ChessRepertoire {
    const repertoire = this.createEmptyRepertoire()
    const transpositionIndex = new Map<string, TranspositionElement>()

    // Position initiale
    const startPos = new ChessPosition(repertoire.startingPosition)

    // Ajouter le coup 1. d4
    const moveD4 = createTestMove("d2", "d4", "d4", "fen-after-d4")
    startPos.moves.set("d4", moveD4)

    // Position après 1. d4
    const positionAfterD4 = new ChessPosition("fen-after-d4")

    // Ajouter les coups 1... d5 et 1... e5
    const moveD5 = createTestMove("d7", "d5", "d5", "fen-after-d4-d5", "b")
    const moveE5 = createTestMove("e7", "e5", "e5", "fen-after-d4-e5", "b")
    positionAfterD4.moves.set("d5", moveD5)
    positionAfterD4.moves.set("e5", moveE5)

    // Positions après 1. d4 d5 et 1. d4 e5
    const positionAfterD4D5 = new ChessPosition("fen-after-d4-d5")
    const positionAfterD4E5 = new ChessPosition("fen-after-d4-e5")

    // Ajouter les coups 2. e4
    const moveE4AfterD4D5 = createTestMove(
      "e2",
      "e4",
      "e4",
      "fen-after-d4-d5-e4",
    )
    const moveE4AfterD4E5 = createTestMove(
      "e2",
      "e4",
      "e4",
      "fen-after-d4-e5-e4",
    )
    positionAfterD4D5.moves.set("e4", moveE4AfterD4D5)
    positionAfterD4E5.moves.set("e4", moveE4AfterD4E5)

    // Positions après 2. e4
    const positionAfterD4D5E4 = new ChessPosition("fen-after-d4-d5-e4")
    const positionAfterD4E5E4 = new ChessPosition("fen-after-d4-e5-e4")

    // Ajouter les coups 2... e5 et 2... d5 qui mènent à la même position (transposition)
    const moveE5AfterD4D5E4 = createTestMove(
      "e7",
      "e5",
      "e5",
      "fen-transposition",
      "b",
    )
    const moveD5AfterD4E5E4 = createTestMove(
      "d7",
      "d5",
      "d5",
      "fen-transposition",
      "b",
    )
    positionAfterD4D5E4.moves.set("e5", moveE5AfterD4D5E4)
    positionAfterD4E5E4.moves.set("d5", moveD5AfterD4E5E4)

    // Enregistrer toutes les positions dans le répertoire
    repertoire.positions.set(repertoire.startingPosition, startPos)
    repertoire.positions.set("fen-after-d4", positionAfterD4)
    repertoire.positions.set("fen-after-d4-d5", positionAfterD4D5)
    repertoire.positions.set("fen-after-d4-e5", positionAfterD4E5)
    repertoire.positions.set("fen-after-d4-d5-e4", positionAfterD4D5E4)
    repertoire.positions.set("fen-after-d4-e5-e4", positionAfterD4E5E4)

    return repertoire
  }

  /**
   * Crée un répertoire avec une transposition et un coup de continuation
   * Ligne 1: 1. d4 d5 2. e4 e5 3. g3
   * Ligne 2: 1. d4 e5 2. e4 d5 3. g3
   */
  static createTranspositionWithContinuationRepertoire(): ChessRepertoire {
    const repertoire = this.createSimpleTranspositionRepertoire()

    // Position après la transposition
    const positionAfterTransposition = new ChessPosition("fen-transposition")

    // Ajouter le coup 3. g3
    const moveG3 = createTestMove(
      "g2",
      "g3",
      "g3",
      "fen-after-transposition-g3",
    )
    positionAfterTransposition.moves.set("g3", moveG3)

    // Enregistrer la position dans le répertoire
    repertoire.positions.set("fen-transposition", positionAfterTransposition)

    return repertoire
  }

  /**
   * Crée un répertoire avec une transposition et des réponses multiples
   * Ligne 1: 1. d4 d5 2. e4 e5 3. g3 Nc6
   * Ligne 2: 1. d4 d5 2. e4 e5 3. g3 Nf6
   * Ligne 3: 1. d4 e5 2. e4 d5 3. g3 Nc6
   * Ligne 4: 1. d4 e5 2. e4 d5 3. g3 Nf6
   */
  static createTranspositionWithMultipleResponsesRepertoire(): ChessRepertoire {
    const repertoire = this.createTranspositionWithContinuationRepertoire()

    // Position après 3. g3
    const positionAfterG3 = new ChessPosition("fen-after-transposition-g3")

    // Ajouter les coups 3... Nc6 et 3... Nf6
    const moveNc6 = createTestMove(
      "b8",
      "c6",
      "Nc6",
      "fen-after-transposition-g3-Nc6",
      "b",
    )
    const moveNf6 = createTestMove(
      "g8",
      "f6",
      "Nf6",
      "fen-after-transposition-g3-Nf6",
      "b",
    )
    positionAfterG3.moves.set("Nc6", moveNc6)
    positionAfterG3.moves.set("Nf6", moveNf6)

    // Enregistrer la position dans le répertoire
    repertoire.positions.set("fen-after-transposition-g3", positionAfterG3)

    return repertoire
  }

  /**
   * Crée un répertoire complexe avec transposition et réponses adverses multiples
   * Structure produite :
   * - 1. d4 d5 2. e4 e5 3. exd5 (transposition)
   * - 1. d4 e5 2. e4 d5 3. exd5 (transposition)
   * Position transposée : rnbqkbnr/ppp2ppp/8/3Pp3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3
   * Réponses adverses : d6 et exd4
   */
  static async createComplexTranspositionRepertoire(): Promise<ChessRepertoire> {
    let repertoireIndex = await readRepertoiresFromJsonToIndex()
    let repertoire = repertoireIndex.get("3")
    // Sanitize FEN strings in positions
    const sanitizedPositions = new Map<string, ChessPosition>()
    repertoire.positions.forEach((position, fen) => {
      const sanitizedFen = sanitizeFen(fen)
      const sanitizedPosition = new ChessPosition(sanitizedFen)

      // Sanitize FEN strings in moves
      position.moves.forEach((move, san) => {
        const sanitizedMove = { ...move, nextFen: sanitizeFen(move.nextFen) }
        sanitizedPosition.moves.set(san, sanitizedMove)
      })

      sanitizedPositions.set(sanitizedFen, sanitizedPosition)
    })

    repertoire.positions = sanitizedPositions
    repertoire.startingPosition = sanitizeFen(repertoire.startingPosition)
    return repertoire
  }

  /**
   * Creates a valid white repertoire with genuine transpositions.
   *
   * Structure:
   * - Main line:    1. d4 d5 2. c4 e6 3. Nc3 Nf6
   * - Alt line 1:   1. d4 Nf6 2. c4 e6 3. Nc3 d5 (transposes to main line)
   * - Alt line 2:   1. d4 e6 2. c4 d5 3. Nc3 Nf6 (transposes to main line)
   *
   * These are valid transpositions because they all end with the exact same pieces
   * in the exact same positions.
   */
  static createMultiLevelTranspositionRepertoire() {
    const repertoire = new ChessRepertoire(
      "test-id",
      "Multi-level Transposition Repertoire",
      "w",
      "fen-start",
    )

    // Add starting position
    const startPos = new ChessPosition("fen-start")
    repertoire.positions.set("fen-start", startPos)

    // 1. d4 (first move for all lines)
    const d4Move = createTestMove("d2", "d4", "d4", "fen-after-d4")
    startPos.moves.set("d4", d4Move)

    // Add position after 1. d4
    const posAfterD4 = new ChessPosition("fen-after-d4")
    repertoire.positions.set("fen-after-d4", posAfterD4)

    // ----- Black's first responses -----

    // 1... d5 (Main line response)
    const d5Move = createTestMove("d7", "d5", "d5", "fen-after-d4-d5", "b")
    posAfterD4.moves.set("d5", d5Move)

    // 1... Nf6 (Alt line 1)
    const nf6Move = createTestMove("g8", "f6", "Nf6", "fen-after-d4-nf6", "b")
    posAfterD4.moves.set("Nf6", nf6Move)

    // 1... e6 (Alt line 2)
    const e6FirstMove = createTestMove("e7", "e6", "e6", "fen-after-d4-e6", "b")
    posAfterD4.moves.set("e6", e6FirstMove)

    // ----- White's second move -----

    // After 1. d4 d5
    const posAfterD4D5 = new ChessPosition("fen-after-d4-d5")
    repertoire.positions.set("fen-after-d4-d5", posAfterD4D5)

    // 2. c4 (Main line)
    const c4Move = createTestMove("c2", "c4", "c4", "fen-after-d4-d5-c4")
    posAfterD4D5.moves.set("c4", c4Move)

    // After 1. d4 Nf6
    const posAfterD4Nf6 = new ChessPosition("fen-after-d4-nf6")
    repertoire.positions.set("fen-after-d4-nf6", posAfterD4Nf6)

    // 2. c4 (Alt line 1)
    const c4AfterNf6Move = createTestMove(
      "c2",
      "c4",
      "c4",
      "fen-after-d4-nf6-c4",
    )
    posAfterD4Nf6.moves.set("c4", c4AfterNf6Move)

    // After 1. d4 e6
    const posAfterD4E6 = new ChessPosition("fen-after-d4-e6")
    repertoire.positions.set("fen-after-d4-e6", posAfterD4E6)

    // 2. c4 (Alt line 2)
    const c4AfterE6Move = createTestMove("c2", "c4", "c4", "fen-after-d4-e6-c4")
    posAfterD4E6.moves.set("c4", c4AfterE6Move)

    // ----- Black's second responses -----

    // After 1. d4 d5 2. c4
    const posAfterD4D5C4 = new ChessPosition("fen-after-d4-d5-c4")
    repertoire.positions.set("fen-after-d4-d5-c4", posAfterD4D5C4)

    // 2... e6 (Main line)
    const e6Move = createTestMove(
      "e7",
      "e6",
      "e6",
      "fen-after-d4-d5-c4-e6",
      "b",
    )
    posAfterD4D5C4.moves.set("e6", e6Move)

    // After 1. d4 Nf6 2. c4
    const posAfterD4Nf6C4 = new ChessPosition("fen-after-d4-nf6-c4")
    repertoire.positions.set("fen-after-d4-nf6-c4", posAfterD4Nf6C4)

    // This is the "middle position" where we'll add a move during test

    // 2... e6 (Alt line 1)
    const e6AltMove = createTestMove(
      "e7",
      "e6",
      "e6",
      "fen-after-d4-nf6-c4-e6",
      "b",
    )
    posAfterD4Nf6C4.moves.set("e6", e6AltMove)

    // After 1. d4 e6 2. c4
    const posAfterD4E6C4 = new ChessPosition("fen-after-d4-e6-c4")
    repertoire.positions.set("fen-after-d4-e6-c4", posAfterD4E6C4)

    // 2... d5 (Alt line 2)
    const d5AltMove = createTestMove(
      "d7",
      "d5",
      "d5",
      "fen-after-d4-e6-c4-d5",
      "b",
    )
    posAfterD4E6C4.moves.set("d5", d5AltMove)

    // ----- White's third move -----

    // After 1. d4 d5 2. c4 e6
    const posAfterD4D5C4E6 = new ChessPosition("fen-after-d4-d5-c4-e6")
    repertoire.positions.set("fen-after-d4-d5-c4-e6", posAfterD4D5C4E6)

    // 3. Nc3 (Main line)
    const nc3Move = createTestMove(
      "b1",
      "c3",
      "Nc3",
      "fen-after-d4-d5-c4-e6-nc3",
    )
    posAfterD4D5C4E6.moves.set("Nc3", nc3Move)

    // After 1. d4 Nf6 2. c4 e6
    const posAfterD4Nf6C4E6 = new ChessPosition("fen-after-d4-nf6-c4-e6")
    repertoire.positions.set("fen-after-d4-nf6-c4-e6", posAfterD4Nf6C4E6)

    // 3. Nc3 (Alt line 1)
    const nc3AltMove = createTestMove(
      "b1",
      "c3",
      "Nc3",
      "fen-after-d4-nf6-c4-e6-nc3",
    )
    posAfterD4Nf6C4E6.moves.set("Nc3", nc3AltMove)

    // After 1. d4 e6 2. c4 d5
    const posAfterD4E6C4D5 = new ChessPosition("fen-after-d4-e6-c4-d5")
    repertoire.positions.set("fen-after-d4-e6-c4-d5", posAfterD4E6C4D5)

    // 3. Nc3 (Alt line 2)
    const nc3Alt2Move = createTestMove(
      "b1",
      "c3",
      "Nc3",
      "fen-after-d4-e6-c4-d5-nc3",
    )
    posAfterD4E6C4D5.moves.set("Nc3", nc3Alt2Move)

    // ----- Black's third responses -----

    // After 1. d4 d5 2. c4 e6 3. Nc3
    const posAfterD4D5C4E6Nc3 = new ChessPosition("fen-after-d4-d5-c4-e6-nc3")
    repertoire.positions.set("fen-after-d4-d5-c4-e6-nc3", posAfterD4D5C4E6Nc3)

    // 3... Nf6 (Main line)
    const nf6MainMove = createTestMove(
      "g8",
      "f6",
      "Nf6",
      "fen-main-transposition",
      "b",
    )
    posAfterD4D5C4E6Nc3.moves.set("Nf6", nf6MainMove)

    // After 1. d4 Nf6 2. c4 e6 3. Nc3
    const posAfterD4Nf6C4E6Nc3 = new ChessPosition("fen-after-d4-nf6-c4-e6-nc3")
    repertoire.positions.set("fen-after-d4-nf6-c4-e6-nc3", posAfterD4Nf6C4E6Nc3)

    // 3... d5 (Alt line 1 - transposes to main line)
    const d5Alt1Move = createTestMove(
      "d7",
      "d5",
      "d5",
      "fen-main-transposition",
      "b",
    )
    posAfterD4Nf6C4E6Nc3.moves.set("d5", d5Alt1Move)

    // After 1. d4 e6 2. c4 d5 3. Nc3
    const posAfterD4E6C4D5Nc3 = new ChessPosition("fen-after-d4-e6-c4-d5-nc3")
    repertoire.positions.set("fen-after-d4-e6-c4-d5-nc3", posAfterD4E6C4D5Nc3)

    // 3... Nf6 (Alt line 2 - transposes to main line)
    const nf6Alt2Move = createTestMove(
      "g8",
      "f6",
      "Nf6",
      "fen-main-transposition",
      "b",
    )
    posAfterD4E6C4D5Nc3.moves.set("Nf6", nf6Alt2Move)

    // Final transposition position
    const mainTranspositionPos = new ChessPosition("fen-main-transposition")
    repertoire.positions.set("fen-main-transposition", mainTranspositionPos)

    return repertoire
  }

  /**
   * Crée un répertoire avec des transpositions multi-niveaux.
   *
   * Structure:
   * - Ligne principale: 1. a3 a6 2. Nc3 Nc6 3. h3 h6 4. Nf3 Nf6
   * - Ligne alt 1: 1. a3 h6 2. h3 Nf6 3. Nf3 Nc6 4. Nc3 a6 (transpose à la principale)
   * - Ligne alt 2: 1. a3 Nf6 2. h3 h6 (transpose à ligne alt 1 après 2...h6)
   */
  static createComplexMultiLevelTranspositionRepertoire() {
    const repertoire = new ChessRepertoire(
      "test-id",
      "Multi-level Transposition Repertoire",
      "w",
      "fen-start",
    )

    // Add starting position
    const startPos = new ChessPosition("fen-start")
    repertoire.positions.set("fen-start", startPos)

    // 1. a3 (first move for all lines)
    const a3Move = createTestMove("a2", "a3", "a3", "fen-after-a3")
    startPos.moves.set("a3", a3Move)

    // Add position after 1. a3
    const posAfterA3 = new ChessPosition("fen-after-a3")
    repertoire.positions.set("fen-after-a3", posAfterA3)

    // ----- Black's first responses -----

    // 1... a6 (Main line response)
    const a6Move = createTestMove("a7", "a6", "a6", "fen-after-a3-a6", "b")
    posAfterA3.moves.set("a6", a6Move)

    // 1... h6 (Alt line 1)
    const h6Move = createTestMove("h7", "h6", "h6", "fen-after-a3-h6", "b")
    posAfterA3.moves.set("h6", h6Move)

    // 1... Nf6 (Alt line 2)
    const nf6Move = createTestMove("g8", "f6", "Nf6", "fen-after-a3-nf6", "b")
    posAfterA3.moves.set("Nf6", nf6Move)

    // ----- White's second move -----

    // After 1. a3 a6
    const posAfterA3A6 = new ChessPosition("fen-after-a3-a6")
    repertoire.positions.set("fen-after-a3-a6", posAfterA3A6)

    // 2. Nc3 (Main line)
    const nc3Move = createTestMove("b1", "c3", "Nc3", "fen-after-a3-a6-nc3")
    posAfterA3A6.moves.set("Nc3", nc3Move)

    // After 1. a3 h6
    const posAfterA3H6 = new ChessPosition("fen-after-a3-h6")
    repertoire.positions.set("fen-after-a3-h6", posAfterA3H6)

    // 2. h3 (Alt line 1)
    const h3AfterH6Move = createTestMove("h2", "h3", "h3", "fen-after-a3-h6-h3")
    posAfterA3H6.moves.set("h3", h3AfterH6Move)

    // After 1. a3 Nf6
    const posAfterA3Nf6 = new ChessPosition("fen-after-a3-nf6")
    repertoire.positions.set("fen-after-a3-nf6", posAfterA3Nf6)

    // 2. h3 (Alt line 2)
    const h3AfterNf6Move = createTestMove(
      "h2",
      "h3",
      "h3",
      "fen-after-a3-nf6-h3",
    )
    posAfterA3Nf6.moves.set("h3", h3AfterNf6Move)

    // ----- Black's second responses -----

    // After 1. a3 a6 2. Nc3
    const posAfterA3A6Nc3 = new ChessPosition("fen-after-a3-a6-nc3")
    repertoire.positions.set("fen-after-a3-a6-nc3", posAfterA3A6Nc3)

    // 2... Nc6 (Main line)
    const nc6Move = createTestMove(
      "b8",
      "c6",
      "Nc6",
      "fen-after-a3-a6-nc3-nc6",
      "b",
    )
    posAfterA3A6Nc3.moves.set("Nc6", nc6Move)

    // After 1. a3 h6 2. h3
    const posAfterA3H6H3 = new ChessPosition("fen-after-a3-h6-h3")
    repertoire.positions.set("fen-after-a3-h6-h3", posAfterA3H6H3)

    // 2... Nf6 (Alt line 1)
    const nf6AltMove = createTestMove(
      "g8",
      "f6",
      "Nf6",
      "fen-alt1-transposition",
      "b",
    )
    posAfterA3H6H3.moves.set("Nf6", nf6AltMove)

    // After 1. a3 Nf6 2. h3
    const posAfterA3Nf6H3 = new ChessPosition("fen-after-a3-nf6-h3")
    repertoire.positions.set("fen-after-a3-nf6-h3", posAfterA3Nf6H3)

    // 2... h6 (Alt line 2 - transposes to Alt line 1)
    const h6AltMove = createTestMove(
      "h7",
      "h6",
      "h6",
      "fen-alt1-transposition",
      "b",
    )
    posAfterA3Nf6H3.moves.set("h6", h6AltMove)

    // ----- Position after Alt line 1 and Alt line 2 transposition -----

    // Position after 1. a3 h6 2. h3 Nf6 or 1. a3 Nf6 2. h3 h6
    const posAlt1Transposition = new ChessPosition("fen-alt1-transposition")
    repertoire.positions.set("fen-alt1-transposition", posAlt1Transposition)

    // ----- White's third move -----

    // After 1. a3 a6 2. Nc3 Nc6
    const posAfterA3A6Nc3Nc6 = new ChessPosition("fen-after-a3-a6-nc3-nc6")
    repertoire.positions.set("fen-after-a3-a6-nc3-nc6", posAfterA3A6Nc3Nc6)

    // 3. h3 (Main line)
    const h3MainMove = createTestMove(
      "h2",
      "h3",
      "h3",
      "fen-after-a3-a6-nc3-nc6-h3",
    )
    posAfterA3A6Nc3Nc6.moves.set("h3", h3MainMove)

    // After 1. a3 h6 2. h3 Nf6 (Alt line 1 transposition point)
    // 3. Nf3 (Alt line 1)
    const nf3AltMove = createTestMove(
      "g1",
      "f3",
      "Nf3",
      "fen-after-a3-h6-h3-nf6-nf3",
    )
    posAlt1Transposition.moves.set("Nf3", nf3AltMove)

    // ----- Black's third responses -----

    // After 1. a3 a6 2. Nc3 Nc6 3. h3
    const posAfterA3A6Nc3Nc6H3 = new ChessPosition("fen-after-a3-a6-nc3-nc6-h3")
    repertoire.positions.set("fen-after-a3-a6-nc3-nc6-h3", posAfterA3A6Nc3Nc6H3)

    // 3... h6 (Main line)
    const h6MainMove = createTestMove(
      "h7",
      "h6",
      "h6",
      "fen-after-a3-a6-nc3-nc6-h3-h6",
      "b",
    )
    posAfterA3A6Nc3Nc6H3.moves.set("h6", h6MainMove)

    // After 1. a3 h6 2. h3 Nf6 3. Nf3
    const posAfterA3H6H3Nf6Nf3 = new ChessPosition("fen-after-a3-h6-h3-nf6-nf3")
    repertoire.positions.set("fen-after-a3-h6-h3-nf6-nf3", posAfterA3H6H3Nf6Nf3)

    // 3... Nc6 (Alt line 1)
    const nc6AltMove = createTestMove(
      "b8",
      "c6",
      "Nc6",
      "fen-after-a3-h6-h3-nf6-nf3-nc6",
      "b",
    )
    posAfterA3H6H3Nf6Nf3.moves.set("Nc6", nc6AltMove)

    // ----- White's fourth move -----

    // After 1. a3 a6 2. Nc3 Nc6 3. h3 h6
    const posAfterA3A6Nc3Nc6H3H6 = new ChessPosition(
      "fen-after-a3-a6-nc3-nc6-h3-h6",
    )
    repertoire.positions.set(
      "fen-after-a3-a6-nc3-nc6-h3-h6",
      posAfterA3A6Nc3Nc6H3H6,
    )

    // 4. Nf3 (Main line)
    const nf3MainMove = createTestMove(
      "g1",
      "f3",
      "Nf3",
      "fen-after-a3-a6-nc3-nc6-h3-h6-nf3",
    )
    posAfterA3A6Nc3Nc6H3H6.moves.set("Nf3", nf3MainMove)

    // After 1. a3 h6 2. h3 Nf6 3. Nf3 Nc6
    const posAfterA3H6H3Nf6Nf3Nc6 = new ChessPosition(
      "fen-after-a3-h6-h3-nf6-nf3-nc6",
    )
    repertoire.positions.set(
      "fen-after-a3-h6-h3-nf6-nf3-nc6",
      posAfterA3H6H3Nf6Nf3Nc6,
    )

    // 4. Nc3 (Alt line 1)
    const nc3AltMove = createTestMove(
      "b1",
      "c3",
      "Nc3",
      "fen-after-a3-h6-h3-nf6-nf3-nc6-nc3",
    )
    posAfterA3H6H3Nf6Nf3Nc6.moves.set("Nc3", nc3AltMove)

    // ----- Black's fourth responses -----

    // After 1. a3 a6 2. Nc3 Nc6 3. h3 h6 4. Nf3
    const posAfterA3A6Nc3Nc6H3H6Nf3 = new ChessPosition(
      "fen-after-a3-a6-nc3-nc6-h3-h6-nf3",
    )
    repertoire.positions.set(
      "fen-after-a3-a6-nc3-nc6-h3-h6-nf3",
      posAfterA3A6Nc3Nc6H3H6Nf3,
    )

    // 4... Nf6 (Main line)
    const nf6MainMove = createTestMove(
      "g8",
      "f6",
      "Nf6",
      "fen-main-transposition",
      "b",
    )
    posAfterA3A6Nc3Nc6H3H6Nf3.moves.set("Nf6", nf6MainMove)

    // After 1. a3 h6 2. h3 Nf6 3. Nf3 Nc6 4. Nc3
    const posAfterA3H6H3Nf6Nf3Nc6Nc3 = new ChessPosition(
      "fen-after-a3-h6-h3-nf6-nf3-nc6-nc3",
    )
    repertoire.positions.set(
      "fen-after-a3-h6-h3-nf6-nf3-nc6-nc3",
      posAfterA3H6H3Nf6Nf3Nc6Nc3,
    )

    // 4... a6 (Alt line 1 - transposes to main line)
    const a6AltMove = createTestMove(
      "a7",
      "a6",
      "a6",
      "fen-main-transposition",
      "b",
    )
    posAfterA3H6H3Nf6Nf3Nc6Nc3.moves.set("a6", a6AltMove)

    // Final transposition position
    const mainTranspositionPos = new ChessPosition("fen-main-transposition")
    repertoire.positions.set("fen-main-transposition", mainTranspositionPos)

    return repertoire
  }

  // Main line    1. a3 a6 2. Nc3 Nc6 3. h3 h6 4. Nf3 Nf6
  // alt line 1 : 1. a3 h6 2. h3 Nf6 3. Nf3 Nc6 4. Nc3 a6 (transpose to main)
  // alt line 2 : 1. a3 Nf6 2. h3 h6 (transpose to line 1 after 1. a3 h6 2. h3 Nf6)
}
