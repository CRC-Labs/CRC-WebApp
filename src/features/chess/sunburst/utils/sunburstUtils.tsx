import { ChessMove } from "../../../../types/ChessMove"
import { ChessPosition } from "../../../../types/ChessPosition"
import { ChessRepertoire } from "../../../../types/Repertoire"
import { SunburstNode } from "../../../../types/SunburstNode"

/**
 * Computes the sunburst data for a given chess repertoire position.
 * The `computeSunburstDataFromPosition` function takes a chess repertoire, a set of suggestions, a position ID, a last move, and a depth and returns the sunburst data for the position.
 * The function first checks if the position is in the repertoire or suggestions and sets the `position` and `suggestionMode` variables accordingly.
 * If the `position` is undefined, the function returns a default sunburst node with a value of 1.
 * The function then gets the candidates for the position and adds them to the `nodes` array.
 * For each candidate, the function creates a sunburst node and adds it to the `nodes` array with its children nodes.
 * If the candidate has no children nodes, the function sets its value to 1.
 * The function then returns the sunburst data for the position.
 * @param repertoire The chess repertoire.
 * @param suggestions The set of suggestions.
 * @param positionId The ID of the position.
 * @param lastMove The last move made.
 * @param depth The depth of the sunburst chart.
 * @returns The sunburst data for the position.
 */
export function computeSunburstDataFromPosition(
  repertoire: ChessRepertoire,
  suggestions: ChessRepertoire,
  positionId: string,
  lastMove: ChessMove,
  depth: number
): SunburstNode {
  let position: ChessPosition
  let suggestionMode = false
  if (repertoire.positions.has(positionId)) {
    position = repertoire.positions.get(positionId)
  } else {
    position = suggestions.positions.get(positionId)
    suggestionMode = true
  }

  if (!position) {
    // If the position is undefined, return a default sunburst node with a value of 1.
    return {
      fen: positionId,
      children: [],
      move: lastMove,
      value: 1,
    }
  }

  let nodes = []

  // For each candidate, create a sunburst node and add it to the `nodes` array with its children nodes.
  position.moves.forEach((move) => {
    let data: SunburstNode = {
      fen: positionId,
      move: move,
    }
    data.children = computeChildrenFromCandidates(
      repertoire,
      suggestions,
      move.nextFen,
      depth - 1
    )
    if (data.children === null || data.children.length === 0) {
      // If the candidate has no children nodes, set its value to 1.
      data.value = 1
    }
    nodes.push(data)
  })

  // Return the sunburst data for the position.
  if (lastMove === undefined || lastMove === null) {
    return {
      fen: positionId,
      children: nodes,
      move: null,
    }
  } else {
    return {
      fen: positionId,
      children: nodes,
      move: lastMove,
    }
  }
}

/**
 * Computes the children nodes for a given chess repertoire position.
 * The `computeChildrenFromCandidates` function takes a chess repertoire, a set of suggestions, a position ID, and a depth and returns the children nodes for the position.
 * The function first checks if the depth is less than 0 and returns null if it is.
 * The function then checks if the position is in the repertoire or suggestions and sets the `position` and `suggestionMode` variables accordingly.
 * If the `position` is undefined, the function returns null.
 * The function then gets the candidates for the position and adds them to the `children` array.
 * For each candidate, the function creates a sunburst node and adds it to the `children` array with its children nodes.
 * If the candidate has no children nodes, the function sets its value to 1.
 * @param repertoire The chess repertoire.
 * @param suggestions The set of suggestions.
 * @param positionId The ID of the position.
 * @param depth The depth of the sunburst chart.
 * @returns The children nodes for the position.
 */
export function computeChildrenFromCandidates(
  repertoire: ChessRepertoire,
  suggestions: ChessRepertoire,
  positionId: string,
  depth: number
): SunburstNode[] {
  if (depth < 0) {
    // If the depth is less than 0, return null.
    return null
  }
  let suggestionMode = false
  let position: ChessPosition
  if (repertoire.positions.has(positionId)) {
    position = repertoire.positions.get(positionId)
  } else {
    position = suggestions.positions.get(positionId)
    suggestionMode = true
  }

  if (position === undefined) {
    // If the position is undefined, return null.
    return null
  }
  let candidates = position.moves
  if (candidates === undefined || candidates.size === 0) {
    // If the position has no candidates or suggested moves, return an empty array.
    return []
  }
  let children: SunburstNode[] = []
  /* For each candidate we need to create a sunburst node and add it to the list, with his children */
  candidates.forEach((candidate) => {
    let candidateNode: SunburstNode = {
      fen: positionId,
      move: candidate,
      children: computeChildrenFromCandidates(
        repertoire,
        suggestions,
        candidate.nextFen,
        depth - 1
      ),
    }
    if (candidateNode.children === null) {
      // If the candidate has no children nodes, set its value to 1.
      candidateNode.value = 1
    }
    children.push(candidateNode)
  })
  return children
}
/**
 * Converts a chess repertoire object to a `ChessRepertoire` instance.
 * The `getChessRepertoireFromObject` function takes a chess repertoire object and returns a `ChessRepertoire` instance.
 * The function creates a new `ChessRepertoire` instance with the ID, title, color, and starting position of the object.
 * The function then creates a `ChessPosition` instance for each position in the object and adds it to the `positions` map of the `ChessRepertoire` instance.
 * For each move in the position, the function creates a `ChessMove` instance and adds it to the `moves` map of the `ChessPosition` instance.
 * @param repertoire The chess repertoire object.
 * @returns The `ChessRepertoire` instance.
 */
export function getChessRepertoireFromObject(repertoire): ChessRepertoire {
  let r: ChessRepertoire = new ChessRepertoire(
    repertoire.id,
    repertoire.title,
    repertoire.color,
    repertoire.startingPosition
  )

  // For each position in the object, create a `ChessPosition` instance and add it to the `positions` map of the `ChessRepertoire` instance.
  repertoire.positions.forEach((element) => {
    let position: ChessPosition = new ChessPosition(element.id)

    // For each move in the position, create a `ChessMove` instance and add it to the `moves` map of the `ChessPosition` instance.
    element.moves.forEach((move) => {
      position.moves.set(move.san, move)
    })

    r.positions.set(position.id, position)
  })

  return r
}
/**
 * Creates a `Map` of `ChessRepertoire` instances from an array of chess repertoire objects.
 * The `createRepertoireIndexFromRepertoireArray` function takes an array of chess repertoire objects and returns a `Map` of `ChessRepertoire` instances.
 * The function creates a new `Map` instance and adds a `ChessRepertoire` instance for each object in the array.
 * The `id` property of each object is used as the key for the `Map`.
 * @param repertoires The array of chess repertoire objects.
 * @returns The `Map` of `ChessRepertoire` instances.
 */
export function createRepertoireIndexFromRepertoireArray(
  repertoires
): Map<string, ChessRepertoire> {
  let repertoireIndex = new Map<string, ChessRepertoire>()
  repertoires.forEach((repertoire) => {
    repertoireIndex.set(repertoire.id, getChessRepertoireFromObject(repertoire))
  })
  return repertoireIndex
}

/**
 * Creates a `ChessRepertoire` instance from an array of suggestion objects.
 * The `createSuggestionsRepertoireFromSuggestionArray` function takes an array of suggestion objects and returns a `ChessRepertoire` instance.
 * The function creates a new `ChessRepertoire` instance with a default ID, title, color, and starting position.
 * The function then creates a `ChessPosition` instance for each suggestion object and adds it to the `positions` map of the `ChessRepertoire` instance.
 * For each move in the position, the function creates a `ChessMove` instance and adds it to the `moves` map of the `ChessPosition` instance.
 * @param suggestionList The array of suggestion objects.
 * @returns The `ChessRepertoire` instance.
 */
export function createSuggestionsRepertoireFromSuggestionArray(
  suggestionList
): ChessRepertoire {
  let suggestionsRepertoire: ChessRepertoire = new ChessRepertoire(
    "lol",
    "suggestionsRepertoire",
    "w",
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  )

  // For each suggestion object, create a `ChessPosition` instance and add it to the `positions` map of the `ChessRepertoire` instance.
  suggestionList.forEach((element) => {
    let suggestedPosition: ChessPosition = new ChessPosition(element.id)

    // For each move in the position, create a `ChessMove` instance and add it to the `moves` map of the `ChessPosition` instance.
    element.moves.forEach((move) => {
      suggestedPosition.moves.set(move.san, move)
    })

    suggestionsRepertoire.positions.set(suggestedPosition.id, suggestedPosition)
  })

  return suggestionsRepertoire
}
