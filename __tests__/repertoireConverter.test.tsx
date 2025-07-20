import { convertRepertoireToChessLine } from "../src/features/chess/lines/utils/repertoireConverter"
import { getLinePgnUpToIndex } from "../src/features/chess/logic/utils/pgnUtils"
import { RepertoireTestFactory } from "../src/features/tests/repertoireTestFactory"

describe("Build lines and handle transpositions", () => {
  test("Detect transpositions while building simple lines", () => {
    // Arrange
    const repertoire =
      RepertoireTestFactory.createSimpleTranspositionRepertoire()

    // Create two lines that will transpose
    // Line 1: 1. d4 d5 2. e4 e5
    // Line 2: 1. d4 e5 2. e4 d5
    // These two lines lead to the same position

    // Act
    const { root: linesData, transpositionIndex } =
      convertRepertoireToChessLine(repertoire)

    // Assert
    expect(transpositionIndex.has("fen-transposition")).toBeTruthy()
    const transpositionElement = transpositionIndex.get("fen-transposition")
    expect(transpositionElement).toBeDefined()

    // Verify line structure
    expect(linesData.children.length).toBe(1) // Only one main line: 1. d4

    // Find the d4 line
    const d4Line = linesData.children[0]
    expect(d4Line.moveSequence[0].san).toBe("d4")

    // Verify this line has two children (after d5 and e5)
    expect(d4Line.children.length).toBe(2)

    // Find the d4-d5 and d4-e5 lines
    const d4d5e4e5Line = d4Line.children.find(
      (line) => line.moveSequence[0].san === "d5",
    )
    const d4e5e4d5Line = d4Line.children.find(
      (line) => line.moveSequence[0].san === "e5",
    )

    // Verify these lines have a transposition
    expect(d4d5e4e5Line.flags.isShared).toBeTruthy()
    expect(d4e5e4d5Line.transposition).toBeDefined()

    // Verify the shared line has isShared flag set to true
    expect(transpositionElement.line).toBeDefined()

    // Verify references are correct
    expect(transpositionElement.usedIn).toBeDefined()
    expect(transpositionElement.usedIn.length).toBe(1)

    // Verify moveIndex in references
    const d4d5e4e5Ref = transpositionElement.usedIn.find(
      (ref) => ref.line === d4d5e4e5Line,
    )
    const d4e5e4d5Ref = transpositionElement.usedIn.find(
      (ref) => ref.line === d4e5e4d5Line,
    )

    expect(d4e5e4d5Ref).toBeDefined()
    // moveIndex should correspond to the position of the move leading to transposition
    // In our case, it's the 3rd move (index 2) for both lines
    expect(d4e5e4d5Ref.moveIndex).toBe(2)

    // Verify the moveSequence of both lines is correct
    // d4d5e4e5Line should have 3 moves: d5, e4, e5
    expect(d4d5e4e5Line.moveSequence.length).toBe(3)
    expect(d4d5e4e5Line.moveSequence[0].san).toBe("d5")
    expect(d4d5e4e5Line.moveSequence[1].san).toBe("e4")
    expect(d4d5e4e5Line.moveSequence[2].san).toBe("e5")

    // d4e5e4d5Line should have 3 moves: e5, e4, d5
    expect(d4e5e4d5Line.moveSequence.length).toBe(3)
    expect(d4e5e4d5Line.moveSequence[0].san).toBe("e5")
    expect(d4e5e4d5Line.moveSequence[1].san).toBe("e4")
    expect(d4e5e4d5Line.moveSequence[2].san).toBe("d5")
    // Vérifier le statut unfinished pour les lignes principales
    expect(d4d5e4e5Line.unfinished).toBe(true) // Termine par un coup de l'adversaire avec une réponse (e5)
  })

  test("Detect transpositions while building lines with continuation", () => {
    // Arrange
    const repertoire =
      RepertoireTestFactory.createTranspositionWithContinuationRepertoire()

    // Setup repertoire with the equivalent of those lines
    // Line 1: 1. d4 d5 2. e4 e5 3. g3
    // Line 2: 1. d4 e5 2. e4 d5 3. g3
    // These two lines lead to the same position from move 3.

    // Act
    const { root: linesData, transpositionIndex } =
      convertRepertoireToChessLine(repertoire)

    //After processing, linesData should be a root line
    //This root line have no children just after creating a new repertoire, because no moves are registered in the repertoire
    //If we register a move in the repertoire, the root line will have one children, which is a ChessLine containing the played move in its moveSequence
    //The root line can only have several children for a black repertoire, as we only allow multiple moves for the opponent in a repertoire

    //In our test case, the repertoire represent a conceptual version of those lines
    // Line 1: 1. d4 d5 2. e4 e5 3. g3
    // Line 2: 1. d4 e5 2. e4 d5 3. g3
    //But the processing will build this
    // root.children[0] = (Line "1. d4" with 2 children)
    //Line1.children[0] = Line1a "1. d4 d5 2. e4 e5 3. g3"
    //Line1.children[1] = Line1b "1. d4 e5 2. e4 d5"
    //Plus line 1b is using a transposition (1a)

    // Assert
    expect(transpositionIndex.has("fen-transposition")).toBeTruthy()
    const transpositionElement = transpositionIndex.get("fen-transposition")
    expect(transpositionElement).toBeDefined()

    // Verify line structure
    expect(linesData.children.length).toBe(1) // Only one main line: 1. d4

    // Find the d4 line
    const d4Line = linesData.children[0]
    expect(d4Line.moveSequence[0].san).toBe("d4")

    // Verify this line has two children (after d5 and e5)
    expect(d4Line.children.length).toBe(2)

    // Find the d4d5e4e5g3Line and d4e5e4d5g3Line lines
    const d4d5e4e5g3Line = d4Line.children.find(
      (line) => line.moveSequence[0].san === "d5",
    )
    const d4e5e4d5g3Line = d4Line.children.find(
      (line) => line.moveSequence[0].san === "e5",
    )

    // Verify these lines have a transposition
    expect(d4e5e4d5g3Line.transposition).toBeDefined()

    // Verify the shared line has isShared flag set to true
    expect(transpositionElement.line.flags.isShared).toBeTruthy()

    // Verify references are correct
    expect(transpositionElement.usedIn).toBeDefined()
    expect(transpositionElement.usedIn.length).toBe(1)

    // Verify moveIndex in references
    const d4d5e4e5Ref = transpositionElement.usedIn.find(
      (ref) => ref.line === d4d5e4e5g3Line,
    )
    const d4e5e4d5Ref = transpositionElement.usedIn.find(
      (ref) => ref.line === d4e5e4d5g3Line,
    )

    expect(d4e5e4d5Ref).toBeDefined()

    // moveIndex should correspond to the position of the move leading to transposition
    // In our case, it's the 3rd move (index 2) for both lines
    expect(d4e5e4d5Ref.moveIndex).toBe(2)

    // Verify the moveSequence of both lines is correct
    // d4d5e4e5g3Line should have 3 moves: d5, e4, e5
    expect(d4d5e4e5g3Line.moveSequence.length).toBe(4)
    expect(d4d5e4e5g3Line.moveSequence[0].san).toBe("d5")
    expect(d4d5e4e5g3Line.moveSequence[1].san).toBe("e4")
    expect(d4d5e4e5g3Line.moveSequence[2].san).toBe("e5")
    expect(d4d5e4e5g3Line.moveSequence[3].san).toBe("g3")

    // d4e5e4d5g3Line should have 3 moves: e5, e4, d5
    expect(d4e5e4d5g3Line.moveSequence.length).toBe(3)
    expect(d4e5e4d5g3Line.moveSequence[0].san).toBe("e5")
    expect(d4e5e4d5g3Line.moveSequence[1].san).toBe("e4")
    expect(d4e5e4d5g3Line.moveSequence[2].san).toBe("d5")

    const sharedLine = transpositionElement.line
    expect(sharedLine).toBeDefined()
    expect(sharedLine.pgn).toBe("1. d4 d5 2. e4 e5 3. g3")
    expect(sharedLine).toBe(d4d5e4e5g3Line)
  })

  test("Detect transpositions while building lines with children", () => {
    // Arrange
    const repertoire =
      RepertoireTestFactory.createTranspositionWithMultipleResponsesRepertoire()

    // Setup repertoire with the equivalent of those lines
    // Line 1: 1. d4 d5 2. e4 e5 3. g3 Nc6
    // Line 2: 1. d4 d5 2. e4 e5 3. g3 Nf6
    // Line 3: 1. d4 e5 2. e4 d5 3. g3 Nc6
    // Line 4: 1. d4 e5 2. e4 d5 3. g3 Nf6
    // These 4 lines lead to the same position from move 3.

    // Act
    const { root: linesData, transpositionIndex } =
      convertRepertoireToChessLine(repertoire)

    // Assert
    expect(transpositionIndex.has("fen-transposition")).toBeTruthy()
    const transpositionElement = transpositionIndex.get("fen-transposition")
    expect(transpositionElement).toBeDefined()

    // Verify line structure
    expect(linesData.children.length).toBe(1) // Only one main line: 1. d4

    // Find the d4 line
    const d4Line = linesData.children[0]
    expect(d4Line.moveSequence[0].san).toBe("d4")
    expect(d4Line.depth).toBe(0)
    // Verify this line has two children (after d5 and e5)
    expect(d4Line.children.length).toBe(2)

    // Find the d4d5e4e5g3Line and d4e5e4d5g3Line lines
    const d4d5e4e5g3Line = d4Line.children.find(
      (line) => line.moveSequence[0].san === "d5",
    )
    const d4e5e4d5g3Line = d4Line.children.find(
      (line) => line.moveSequence[0].san === "e5",
    )

    expect(d4d5e4e5g3Line.depth).toBe(1)
    expect(d4e5e4d5g3Line.depth).toBe(1)

    // Verify these lines have a transposition
    expect(d4d5e4e5g3Line.flags.isShared).toBeTruthy()
    expect(d4e5e4d5g3Line.transposition).toBeDefined()

    // Verify the shared line has isShared flag set to true
    const sharedLine = transpositionElement.line

    // Verify the shared line is d4d5e4e5g3Line
    expect(sharedLine).toBe(d4d5e4e5g3Line)

    // Verify the shared line has two children (Nc6 and Nf6)
    expect(sharedLine.children.length).toBe(2)

    // Find the Nc6 and Nf6 children of the shared line
    const sharedLineNc6Child = sharedLine.children.find(
      (child) =>
        child.moveSequence[child.moveSequence.length - 1].san === "Nc6",
    )
    const sharedLineNf6Child = sharedLine.children.find(
      (child) =>
        child.moveSequence[child.moveSequence.length - 1].san === "Nf6",
    )

    expect(sharedLineNc6Child).toBeDefined()
    expect(sharedLineNf6Child).toBeDefined()

    expect(d4d5e4e5g3Line.children.length).toBe(2)
    expect(d4e5e4d5g3Line.children.length).toBe(0)

    // Verify the children of the first line (1. d4 d5 2. e4 e5 3. g3)
    const d4d5e4e5g3Nc6Line = d4d5e4e5g3Line.children.find(
      (child) =>
        child.moveSequence[child.moveSequence.length - 1].san === "Nc6",
    )
    const d4d5e4e5g3Nf6Line = d4d5e4e5g3Line.children.find(
      (child) =>
        child.moveSequence[child.moveSequence.length - 1].san === "Nf6",
    )

    expect(d4d5e4e5g3Nc6Line).toBeDefined()
    expect(d4d5e4e5g3Nf6Line).toBeDefined()

    expect(d4d5e4e5g3Nc6Line.depth).toBe(5)
    expect(d4d5e4e5g3Nf6Line.depth).toBe(5)

    // Verify that PGNs are correct for each line
    expect(d4d5e4e5g3Nc6Line.pgn).toBe("1. d4 d5 2. e4 e5 3. g3 Nc6")
    expect(d4d5e4e5g3Nf6Line.pgn).toBe("1. d4 d5 2. e4 e5 3. g3 Nf6")
    expect(d4e5e4d5g3Line.pgn).toBe("1. d4 e5 2. e4 d5")
  })

  test("Detect transpositions while building lines with children and complex transpositions", async () => {
    // Arrange
    const repertoire =
      await RepertoireTestFactory.createComplexTranspositionRepertoire()
    const { root: linesData, transpositionIndex } =
      convertRepertoireToChessLine(repertoire)
    expect(linesData).toBeDefined()
    // Verify line structure
    expect(linesData.children.length).toBe(1) // Only one main line: 1. d4

    // Find the d4 line
    const d4Line = linesData.children[0]
    expect(d4Line.moveSequence[0].san).toBe("d4")
    expect(d4Line.depth).toBe(0)

    // Verify this line has two children (after d5 and e5)
    expect(d4Line.children.length).toBe(2)

    // Find the d4d5e4e5exd5Line
    const d4d5e4e5exd5Line = d4Line.children.find(
      (line) => line.id === "1. d4 d5 2. e4 e5 3. exd5",
    )

    expect(d4d5e4e5exd5Line.depth).toBe(1)

    expect(
      transpositionIndex.has(
        "rnbqkbnr/ppp2ppp/8/3pp3/3PP3/8/PPP2PPP/RNBQKBNR w KQkq",
      ),
    ).toBeTruthy()
    const transpositionElement = transpositionIndex.get(
      "rnbqkbnr/ppp2ppp/8/3pp3/3PP3/8/PPP2PPP/RNBQKBNR w KQkq",
    )
    expect(transpositionElement).toBeDefined()

    // Verify the shared line has isShared flag set to true
    const sharedLine = transpositionElement.line
    expect(sharedLine.flags.isShared).toBeTruthy()

    expect(sharedLine.pgn).toBe(d4d5e4e5exd5Line.pgn)

    // Verify the shared line contains the g3 move
    expect(d4d5e4e5exd5Line.moveSequence.length).toBe(4)

    // Verify the shared line has two children
    expect(sharedLine.children.length).toBe(2)

    // Find child lines with moves "e4" and "exd4"
    const e4Line = sharedLine.children.find(
      (line) => line.moveSequence[0].san === "e4",
    )
    const exd4Line = sharedLine.children.find(
      (line) => line.moveSequence[0].san === "exd4",
    )

    // Verify both child lines exist
    expect(e4Line).toBeDefined()
    expect(exd4Line).toBeDefined()

    expect(e4Line.children.length).toBe(0)
    expect(exd4Line.children.length).toBe(0)

    // Find the d4d5e4e5exd5Line and d4e5e4d5exd5Line lines
    const d4d5e4e5exd5e4d6Line = d4d5e4e5exd5Line.children.find(
      (line) => line.id === "1. d4 d5 2. e4 e5 3. exd5 e4 4. d6",
    )
    const d4d5e4e5exd5exd4Line = d4d5e4e5exd5Line.children.find(
      (line) => line.id === "1. d4 d5 2. e4 e5 3. exd5 exd4",
    )

    expect(d4d5e4e5exd5e4d6Line).toBeDefined()
    expect(d4d5e4e5exd5exd4Line).toBeDefined()

    expect(d4d5e4e5exd5e4d6Line.depth).toBe(5)
    expect(d4d5e4e5exd5exd4Line.depth).toBe(5)

    // Assertions pour vérifier l'index de transposition
    expect(
      getLinePgnUpToIndex(
        transpositionElement.line,
        transpositionElement.moveIndex,
      ),
    ).toBe("1. d4 d5 2. e4 e5")
    expect(transpositionElement.moveIndex).toBe(2) // L'index du coup "exd5" dans la séquence

    // Trouver la ligne qui utilise cette transposition (1. d4 e5 2. e4 d5)
    const d4e5e4d5Line = d4Line.children.find(
      (line) => line.pgn === "1. d4 e5 2. e4 d5",
    )
    expect(d4e5e4d5Line).toBeDefined()

    // Vérifier que cette ligne a une référence de transposition
    expect(d4e5e4d5Line.transposition).toBeDefined()
    expect(d4e5e4d5Line.transposition).toBe(transpositionElement)

    // Important: Vérifier que le moveIndex dans la transposition est correct
    // Ici le moveIndex est 0 car c'est après le premier coup de la séquence que la transposition se produit
    const usedInReference = transpositionElement.usedIn.find(
      (ref) => ref.line === d4e5e4d5Line,
    )
    expect(usedInReference).toBeDefined()
    expect(usedInReference.moveIndex).toBe(2)

    // Vérifier la cohérence entre les pgn des lignes:
    // - La ligne principale est celle qui contient le chemin complet
    // - La ligne qui utilise la transposition ne contient que le préfixe
    expect(sharedLine.pgn).toBe("1. d4 d5 2. e4 e5 3. exd5")
    expect(d4e5e4d5Line.pgn).toBe("1. d4 e5 2. e4 d5")

    // Vérifier les moveSequence
    expect(sharedLine.moveSequence.length).toBe(4) // d4, d5, e4, e5, exd5 (4 coups)
    expect(d4e5e4d5Line.moveSequence.length).toBe(3) // d4, e5, e4

    // Vérifier les enfants de la ligne partagée
    expect(sharedLine.children.length).toBe(2)

    // Vérifier la consistance de l'index de transposition global
    for (const [fen, element] of transpositionIndex.entries()) {
      // Si une ligne est référencée par d'autres lignes, elle doit être marquée comme partagée
      if (element.usedIn && element.usedIn.length > 0) {
        expect(element.line.flags.isShared).toBeTruthy()
        // Vérifier que tous les moveIndex dans usedIn sont valides
        for (const ref of element.usedIn) {
          expect(ref.moveIndex).toBeGreaterThanOrEqual(0)
          expect(ref.moveIndex).toBeLessThan(ref.line.moveSequence.length)
        }
      }
    }

    // Vérifier les pgn des lignes enfants
    for (const child of sharedLine.children) {
      // Le pgn de l'enfant doit commencer par le pgn du parent
      expect(child.pgn.startsWith(sharedLine.pgn)).toBeTruthy()

      // La profondeur doit être correcte
      expect(child.depth).toBe(5) // Dans ce cas spécifique, les enfants sont à la profondeur 5
    }

    // Vérifier le statut unfinished des lignes principales
    expect(d4d5e4e5exd5Line.unfinished).toBe(false) // Se termine par un coup blanc (exd5)

    // Vérifier le statut unfinished des lignes enfants
    expect(e4Line.unfinished).toBe(false) // Se termine par un coup blanc (e4)
    expect(exd4Line.unfinished).toBe(true) // Se termine par un coup noir (exd4)

    // Vérifier le statut unfinished des lignes avec des coups supplémentaires
    expect(d4d5e4e5exd5e4d6Line.unfinished).toBe(false) // Se termine par un coup blanc (d6)
    expect(d4d5e4e5exd5exd4Line.unfinished).toBe(true) // Se termine par un coup noir (exd4)

    // Vérifier la cohérence du statut unfinished à travers les transpositions
    if (d4e5e4d5Line.transposition) {
      // Une ligne qui utilise une transposition devrait hériter du statut unfinished
      // de la ligne de transposition
      expect(d4e5e4d5Line.unfinished).toBe(
        d4e5e4d5Line.transposition.line.unfinished,
      )
    }

    // Vérifier que les lignes qui se terminent par un coup adverse sans réponse sont marquées unfinished
    for (const child of sharedLine.children) {
      const lastMove = child.moveSequence[child.moveSequence.length - 1]
      if (lastMove.color !== repertoire.color && child.children.length === 0) {
        expect(child.unfinished).toBe(true)
      } else if (
        lastMove.color === repertoire.color ||
        child.children.length > 0
      ) {
        expect(child.unfinished).toBe(false)
      }
    }
  })

  test("Detect transpositions while building lines with more children and complex transpositions", async () => {
    // Arrange
    const repertoire =
      await RepertoireTestFactory.createMultiLevelTranspositionRepertoire()

    const { root: linesData, transpositionIndex } =
      convertRepertoireToChessLine(repertoire)
    expect(linesData).toBeDefined()
    //ToBeFixed
    // Verify line structure
    expect(linesData.children.length).toBe(1) // Only one main line: 1. d4

    // Find the d4 line
    const d4Line = linesData.children[0]
    expect(d4Line.moveSequence[0].san).toBe("d4")
    expect(d4Line.depth).toBe(0)

    expect(d4Line.children.length).toBe(3)

    // Find the first line
    const firstLine = d4Line.children.find(
      (line) => line.id === "1. d4 d5 2. c4 e6 3. Nc3 Nf6",
    )

    expect(firstLine.depth).toBe(1)

    expect(transpositionIndex.has("fen-main-transposition")).toBeTruthy()
    const transpositionElement = transpositionIndex.get(
      "fen-main-transposition",
    )
    expect(transpositionElement).toBeDefined()
    expect(transpositionElement.usedIn).toBeDefined()
    expect(transpositionElement.usedIn.length).toBe(2)

    // Verify the shared line has isShared flag set to true
    const sharedLine = transpositionElement.line
    expect(sharedLine.flags.isShared).toBeTruthy()

    expect(sharedLine.pgn).toBe(firstLine.pgn)

    expect(firstLine.moveSequence.length).toBe(5)

    expect(sharedLine.children.length).toBe(0)

    // Find the other lines
    const secondLine = d4Line.children.find(
      (line) => line.id === "1. d4 Nf6 2. c4 e6 3. Nc3 d5",
    )

    const thirdLine = d4Line.children.find(
      (line) => line.id === "1. d4 e6 2. c4 d5 3. Nc3 Nf6",
    )

    expect(secondLine.transposition).toBeDefined()
    expect(secondLine.transposition.line.pgn).toBe(firstLine.pgn)
    expect(thirdLine.transposition).toBeDefined()
    expect(thirdLine.transposition.line.pgn).toBe(firstLine.pgn)
  })
  test("Detect transpositions while building lines with children and multilevel transpositions", async () => {
    // Arrange
    const repertoire =
      await RepertoireTestFactory.createComplexMultiLevelTranspositionRepertoire()

    const { root: linesData, transpositionIndex } =
      convertRepertoireToChessLine(repertoire)
    expect(linesData).toBeDefined()
    //ToBeFixed
    // Verify line structure
    expect(linesData.children.length).toBe(1) // Only one main line: 1. a3

    // Find the a3 line
    const a3 = linesData.children[0]
    expect(a3.moveSequence[0].san).toBe("a3")
    expect(a3.depth).toBe(0)

    expect(a3.children.length).toBe(3)

    // Find the first line
    const mainLine = a3.children.find(
      (line) => line.id === "1. a3 a6 2. Nc3 Nc6 3. h3 h6 4. Nf3 Nf6",
    )

    expect(mainLine.depth).toBe(1)

    expect(transpositionIndex.has("fen-main-transposition")).toBeTruthy()
    const transpositionElement = transpositionIndex.get(
      "fen-main-transposition",
    )
    expect(transpositionElement).toBeDefined()
    expect(transpositionElement.usedIn).toBeDefined()
    expect(transpositionElement.usedIn.length).toBe(1)

    // Verify the shared line has isShared flag set to true
    const sharedLine = transpositionElement.line
    expect(sharedLine.flags.isShared).toBeTruthy()

    expect(sharedLine.pgn).toBe(mainLine.pgn)

    expect(mainLine.moveSequence.length).toBe(7)

    expect(sharedLine.children.length).toBe(0)

    // Find the other lines
    const secondLine = a3.children.find(
      (line) => line.id === "1. a3 h6 2. h3 Nf6 3. Nf3 Nc6 4. Nc3 a6",
    )

    const thirdLine = a3.children.find(
      (line) => line.id === "1. a3 Nf6 2. h3 h6",
    )

    expect(secondLine.transposition).toBeDefined()
    expect(secondLine.transposition.line.pgn).toBe(mainLine.pgn)
    expect(thirdLine.transposition).toBeDefined()
    expect(thirdLine.transposition.line.pgn).toBe(secondLine.pgn)
  })
})
