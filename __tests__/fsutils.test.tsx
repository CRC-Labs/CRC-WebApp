const repertoireIndexLength = 4
const suggestionIndexLength = 40
import { readRepertoiresFromJson, readRepertoiresFromJsonToIndex, readSuggestionsFromJsonToRepertoire } from "../src/features/common/utils/fsutils"
import { ChessRepertoire } from "../src/types/Repertoire"


test("Read repertoires from json to array ( readRepertoiresFromJson )", async () => {
  let repertoires = await readRepertoiresFromJson()
  expect(repertoires.length).toBe(4)
})

test("Read repertoires from json to index ( readRepertoiresFromJsonToIndex )", async () => {
  let repertoireIndex = await readRepertoiresFromJsonToIndex()
  expect(repertoireIndex.size).toBe(repertoireIndexLength)
  expect(repertoireIndex.has("0")).toBe(true)
  expect(repertoireIndex.has("1")).toBe(true)
  expect(repertoireIndex.has("2")).toBe(true)
  expect(repertoireIndex.has("3")).toBe(true)
})

test("Read suggestions from json to index ( readSuggestionsFromJsonToIndex )", async () => {
  let suggRepertoire: ChessRepertoire =
    await readSuggestionsFromJsonToRepertoire()
  expect(suggRepertoire.positions.size).toBe(suggestionIndexLength)
})
