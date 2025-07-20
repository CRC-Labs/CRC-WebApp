import { determineMoveSeparator, computePgnFromMoveSequence, getLinePgnUpToIndex } from "../src/features/chess/logic/utils/pgnUtils"
import { createTestMove } from "../src/features/tests/repertoireTestFactory"
import { ChessLine } from "../src/types/ChessLine"
import { ChessMove } from "../src/types/ChessMove"


describe("PGN Utilities", () => {
  describe("determineMoveSeparator", () => {
    test("returns correct separator based on depth", () => {
      expect(determineMoveSeparator(0, "")).toBe("1. ")
      expect(determineMoveSeparator(1, "1. e4")).toBe(" ")
      expect(determineMoveSeparator(2, "1. e4 e5")).toBe(" 2. ")
      expect(determineMoveSeparator(3, "1. e4 e5 2. Nf3")).toBe(" ")
      expect(determineMoveSeparator(4, "1. e4 e5 2. Nf3 Nc6")).toBe(" 3. ")
    })

    test("removes leading space for empty parent IDs", () => {
      expect(determineMoveSeparator(0, "")).toBe("1. ")
      expect(determineMoveSeparator(2, "")).toBe("2. ")
    })
  })

  describe("computePgnFromMoveSequence", () => {
    test("returns empty string for empty sequence", () => {
      expect(computePgnFromMoveSequence([], 0)).toBe("")
      expect(computePgnFromMoveSequence(null, 0)).toBe("")
    })

    test("computes correct PGN for white starting moves", () => {
      const moves = [
        createTestMove("e2", "e4", "e4", "fen1"),
        createTestMove("g1", "f3", "Nf3", "fen2"),
      ]
      expect(computePgnFromMoveSequence(moves, 0)).toBe("1. e4 Nf3")
    })

    test("computes correct PGN with proper move numbering", () => {
      const moves = [
        createTestMove("e2", "e4", "e4", "fen1"),
        createTestMove("e7", "e5", "e5", "fen2", "b"),
        createTestMove("g1", "f3", "Nf3", "fen3"),
      ]
      expect(computePgnFromMoveSequence(moves, 0)).toBe("1. e4 e5 2. Nf3")
    })

    test("adjusts numbering based on starting depth", () => {
      const moves = [
        createTestMove("e7", "e5", "e5", "fen1", "b"),
        createTestMove("g1", "f3", "Nf3", "fen2"),
      ]
      expect(computePgnFromMoveSequence(moves, 1)).toBe("e5 2. Nf3")
    })
  })
})

describe('getLinePgnUpToIndex', () => {
  // Utilitaire pour créer une ligne de test
  function createChessLine(pgn: string, moveSequence: ChessMove[], depth: number): ChessLine {
    return {
      id: pgn,
      pgn,
      moveSequence,
      children: [],
      depth,
      flags: { isShared: false, toBeUpdated: false },
      unfinished: false,
      transposition:undefined,
      opening:undefined
    };
  }

  // Utilitaire pour créer un coup
  function createMove(san: string, color: 'w' | 'b', nextFen: string): ChessMove {
    return {
      from: 'dummy',
      to: 'dummy',
      san,
      color,
      nextFen
    };
  }

  test('Retourne le PGN complet quand index est égal à la longueur de moveSequence - 1', () => {
    const moves = [
      createMove('e4', 'w', 'fen1'),
      createMove('e5', 'b', 'fen2')
    ];
    const line = createChessLine('1. e4 e5', moves, 0);
    
    expect(getLinePgnUpToIndex(line, 1)).toBe('1. e4 e5');
  });

  test('Tronque correctement le PGN à l\'index spécifié', () => {
    const moves = [
      createMove('e4', 'w', 'fen1'),
      createMove('e5', 'b', 'fen2'),
      createMove('Nf3', 'w', 'fen3'),
      createMove('Nc6', 'b', 'fen4')
    ];
    const line = createChessLine('1. e4 e5 2. Nf3 Nc6', moves, 0);
    
    expect(getLinePgnUpToIndex(line, 1)).toBe('1. e4 e5');
    expect(getLinePgnUpToIndex(line, 2)).toBe('1. e4 e5 2. Nf3');
  });

  test('Préserve les coups des lignes parentes avec la profondeur', () => {
    // Ligne avec une profondeur de 2 (après 1. e4)
    const moves = [
      createMove('e5', 'b', 'fen1'),
      createMove('Nf3', 'w', 'fen2')
    ];
    const line = createChessLine('1. e4 e5 2. Nf3', moves, 1);
    
    expect(getLinePgnUpToIndex(line, 0)).toBe('1. e4 e5');
    expect(getLinePgnUpToIndex(line, 1)).toBe('1. e4 e5 2. Nf3');
  });

  test('Gère correctement un index qui dépasse la longueur de moveSequence', () => {
    const moves = [
      createMove('e4', 'w', 'fen1'),
      createMove('e5', 'b', 'fen2')
    ];
    const line = createChessLine('1. e4 e5', moves, 0);
    
    expect(getLinePgnUpToIndex(line, 5)).toBe('1. e4 e5');
  });

  test('Retourne une chaîne vide pour une ligne null ou undefined', () => {
    expect(getLinePgnUpToIndex(null, 0)).toBe('');
    expect(getLinePgnUpToIndex(undefined, 0)).toBe('');
  });

  test('Retourne une chaîne vide pour un index négatif', () => {
    const moves = [createMove('e4', 'w', 'fen1')];
    const line = createChessLine('1. e4', moves, 0);
    
    expect(getLinePgnUpToIndex(line, -1)).toBe('');
  });

  test('Gère correctement une ligne avec moveSequence vide', () => {
    const line = createChessLine('1. e4', [], 1);
    expect(getLinePgnUpToIndex(line, 0)).toBe('');
  });

  test('Tronque correctement une ligne qui commence par un coup noir', () => {
    // Ligne qui commence après 1. e4
    const moves = [
      createMove('c5', 'b', 'fen1'),
      createMove('Nf3', 'w', 'fen2')
    ];
    const line = createChessLine('1. e4 c5 2. Nf3', moves, 1);
    
    expect(getLinePgnUpToIndex(line, 0)).toBe('1. e4 c5');
  });

  test('Gère correctement les numérotations dans une position avancée', () => {
    // Ligne qui commence après plusieurs coups
    const moves = [
      createMove('Qd8', 'b', 'fen1'),
      createMove('Rxd8', 'w', 'fen2')
    ];
    const line = createChessLine('1. e4 c5 2. Nf3 e6 3. Nc6 Nc3 4. c4 d5 5. Nxe5 Qd8 6. Rxd8', moves, 9);
    
    expect(getLinePgnUpToIndex(line, 0)).toBe('1. e4 c5 2. Nf3 e6 3. Nc6 Nc3 4. c4 d5 5. Nxe5 Qd8');
    expect(getLinePgnUpToIndex(line, 1)).toBe('1. e4 c5 2. Nf3 e6 3. Nc6 Nc3 4. c4 d5 5. Nxe5 Qd8 6. Rxd8');
  });

  test('Fonctionne correctement avec des PGN contenant des caractères spéciaux', () => {
    // PGN avec des symboles d'annotation
    const moves = [
      createMove('e4', 'w', 'fen1'),
      createMove('e5', 'b', 'fen2'),
      createMove('Nf3', 'w', 'fen3')
    ];
    const line = createChessLine('1. e4! e5 2. Nf3', moves, 0);
    
    expect(getLinePgnUpToIndex(line, 1)).toBe('1. e4! e5');
  });
});

