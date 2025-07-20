import { ChessRepertoire } from "../src/types/Repertoire"

import {
  computeChildrenFromCandidates,
  computeSunburstDataFromPosition,
  createRepertoireIndexFromRepertoireArray,
  createSuggestionsRepertoireFromSuggestionArray,
} from "../src/features/chess/sunburst/utils/sunburstUtils"
import { readRepertoiresFromJson, readRepertoiresFromJsonToIndex, readSuggestionsFromJson, readSuggestionsFromJsonToRepertoire } from "../src/features/common/utils/fsutils"

test("Index Suggestions (createSuggestionsIndexFromSuggestionArray)", async () => {
  let suggs = await readSuggestionsFromJson()
  expect(suggs.length).toBe(1)
  let sugg = suggs[0]
  expect(sugg.length).toBe(40)
  let suggRepertoire: ChessRepertoire =
    createSuggestionsRepertoireFromSuggestionArray(sugg)
  expect(suggRepertoire.positions.size).toBe(40)
})

test("Create repertoireIndex from repertoires ( createRepertoireIndexFromRepertoireArray )", async () => {
  let repertoires = await readRepertoiresFromJson()
  let repertoireIndex = createRepertoireIndexFromRepertoireArray(repertoires)

  expect(repertoireIndex.size).toBe(4)

  expect(repertoireIndex.has("0")).toBe(true)
  expect(repertoireIndex.has("1")).toBe(true)
  expect(repertoireIndex.has("2")).toBe(true)
  expect(repertoireIndex.has("3")).toBe(true)
})

test("Compute children from candidates for empty white repertoire( computeChildrenFromCandidates )", async () => {
  let repertoireIndex = await readRepertoiresFromJsonToIndex()
  let suggestions = await readSuggestionsFromJsonToRepertoire()

  let emptyRepertoire = repertoireIndex.get("0")
  let position = emptyRepertoire.positions.get(emptyRepertoire.startingPosition)
  expect(position).toBe(undefined)

  let children = computeChildrenFromCandidates(
    emptyRepertoire,
    suggestions,
    emptyRepertoire.startingPosition,
    2
  )

  expect(children).toBeDefined()
  expect(children !== null).toBe(true)
  expect(children.length).toBe(3)
  children.forEach((child) => {
    expect(child.move).toBeDefined()
    expect(child.move.nextFen).toBeDefined()
    expect(child.children).toBeDefined()
    expect(child.children.length).toBe(3)
    child.children.forEach((subChild) => {
      expect(subChild.move).toBeDefined()
      expect(subChild.move.nextFen).toBeDefined()
      expect(subChild.children).toBeDefined()
      expect(subChild.children.length).toBe(3)
      subChild.children.forEach((subsubChild) => {
        expect(subsubChild.move).toBeDefined()
        expect(subsubChild.move.nextFen).toBeDefined()
        expect(subsubChild.children).toBe(null)
        expect(subsubChild.value).toBe(1)
      })
    })
  })
})

test("Compute children from candidates for simple depth-1 white repertoire( computeChildrenFromCandidates )", async () => {
  let repertoireIndex = await readRepertoiresFromJsonToIndex()
  let suggestions = await readSuggestionsFromJsonToRepertoire()
  let simpleRepertoire = repertoireIndex.get("1")
  let position = simpleRepertoire.positions.get(
    simpleRepertoire.startingPosition
  )

  expect(position).toBeDefined()

  let children = computeChildrenFromCandidates(
    simpleRepertoire,
    suggestions,
    simpleRepertoire.startingPosition,
    2
  )

  expect(children).toBeDefined()
  expect(children !== null).toBe(true)
  expect(children.length).toBe(1)
  let child = children[0]
  expect(child).toBeDefined()
  expect(child !== null).toBe(true)
  expect(child.fen).toBe(simpleRepertoire.startingPosition)
  expect(child.move).toBeDefined()
  expect(child.children.length).toBe(3)
  child.children.forEach((subChild) => {
    expect(subChild.move).toBeDefined()
    expect(subChild.move.nextFen).toBeDefined()
    expect(subChild.children).toBeDefined()
    expect(subChild.children.length).toBe(3)
  })
})

test("Compute children from candidates with a more complex depth-2 white repertoire( computeChildrenFromCandidates )", async () => {
  let repertoireIndex = await readRepertoiresFromJsonToIndex()
  let suggestions = await readSuggestionsFromJsonToRepertoire()

  let repertoire = repertoireIndex.get("2")
  let position = repertoire.positions.get(repertoire.startingPosition)
  expect(position).toBeDefined()
  expect(position.moves).toBeDefined()
  let children = computeChildrenFromCandidates(
    repertoire,
    suggestions,
    repertoire.startingPosition,
    3
  )

  expect(children).toBeDefined()
  expect(children !== null).toBe(true)
  expect(children.length).toBe(1)
  let child = children[0]
  expect(child).toBeDefined()
  expect(child !== null).toBe(true)
  expect(child.fen).toBe(repertoire.startingPosition)
  expect(child.move).toBeDefined()
  expect(child.children.length).toBe(2)
  child.children.forEach((subChild) => {
    expect(subChild.move).toBeDefined()
    expect(subChild.move.nextFen).toBeDefined()
    expect(subChild.children).toBeDefined()
    expect(subChild.children.length).toBe(3)
  })
})

test("Compute Sunburst data from starting position with an empty white repertoire ( computeSunburstDataFromPosition )", async () => {
  let repertoireIndex = await readRepertoiresFromJsonToIndex()
  let suggestions = await readSuggestionsFromJsonToRepertoire()

  let emptyRepertoire = repertoireIndex.get("0")

  expect("startingPosition" in emptyRepertoire).toBe(true)
  expect(emptyRepertoire.startingPosition).toBe(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  )

  let sunburstData = computeSunburstDataFromPosition(
    emptyRepertoire,
    suggestions,
    emptyRepertoire.startingPosition,
    null,
    1
  )
  expect(sunburstData).toBeDefined()
  expect(sunburstData.move).toBe(null)
  expect(sunburstData.fen).toBe(emptyRepertoire.startingPosition)
  expect(sunburstData.children).toBeDefined()
  expect(sunburstData.children.length).toBe(3)
})

test("Compute Sunburst data from starting position with a simple depth-1 white repertoire ( computeSunburstDataFromPosition )", async () => {
  let repertoireIndex = await readRepertoiresFromJsonToIndex()
  let suggestions = await readSuggestionsFromJsonToRepertoire()

  let simpleRepertoire = repertoireIndex.get("1")

  expect("startingPosition" in simpleRepertoire).toBe(true)
  expect(simpleRepertoire.startingPosition).toBe(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  )

  let sunburstData = computeSunburstDataFromPosition(
    simpleRepertoire,
    suggestions,
    simpleRepertoire.startingPosition,
    null,
    2
  )
  expect(sunburstData).toBeDefined()
  expect(sunburstData.move).toBe(null)
  expect(sunburstData.fen).toBe(simpleRepertoire.startingPosition)
  expect(sunburstData.children).toBeDefined()
  let child = sunburstData.children[0]
  expect(child).toBeDefined()
  expect(child !== null).toBe(true)
  expect(child.fen).toBe(simpleRepertoire.startingPosition)
  expect(child.move).toBeDefined()
  expect(child.children.length).toBe(3)
  child.children.forEach((subChild) => {
    expect(subChild.move).toBeDefined()
    expect(subChild.move.nextFen).toBeDefined()
    expect(subChild.children).toBeDefined()
    expect(subChild.children.length).toBe(3)
  })
})

test("Compute Sunburst data from starting position with a more complex depth-2 white repertoire ( computeSunburstDataFromPosition )", async () => {
  let repertoireIndex = await readRepertoiresFromJsonToIndex()
  let suggestions = await readSuggestionsFromJsonToRepertoire()

  let repertoire = repertoireIndex.get("2")

  expect("startingPosition" in repertoire).toBe(true)
  expect(repertoire.startingPosition).toBe(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  )

  let sunburstData = computeSunburstDataFromPosition(
    repertoire,
    suggestions,
    repertoire.startingPosition,
    null,
    2
  )
  expect(sunburstData).toBeDefined()
  expect(sunburstData.move).toBe(null)
  expect(sunburstData.fen).toBe(repertoire.startingPosition)
  expect(sunburstData.children).toBeDefined()
  let child = sunburstData.children[0]
  expect(child).toBeDefined()
  expect(child !== null).toBe(true)
  expect(child.fen).toBe(repertoire.startingPosition)
  expect(child.move).toBeDefined()
  expect(child.children.length).toBe(2)
  child.children.forEach((subChild) => {
    expect(subChild.move).toBeDefined()
    expect(subChild.move.nextFen).toBeDefined()
    expect(subChild.children).toBeDefined()
    expect(subChild.children.length).toBe(3)
  })
})

test("Compute Sunburst data from 1-depth position with an empty white repertoire ( computeSunburstDataFromPosition )", async () => {
  let repertoireIndex = await readRepertoiresFromJsonToIndex()
  let suggestions = await readSuggestionsFromJsonToRepertoire()

  let emptyRepertoire = repertoireIndex.get("0")

  expect("startingPosition" in emptyRepertoire).toBe(true)
  expect(emptyRepertoire.startingPosition).toBe(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  )

  let sunburstData = computeSunburstDataFromPosition(
    emptyRepertoire,
    suggestions,
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    {
      from:"e2",
      to:"e4",
      san: "e4",
      nextFen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    },
    2
  )
  expect(sunburstData).toBeDefined()
  expect(sunburstData.move != null).toBe(true)
})
