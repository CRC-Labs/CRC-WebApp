import { createRepertoireIndexFromRepertoireArray, createSuggestionsRepertoireFromSuggestionArray } from "../../../features/chess/sunburst/utils/sunburstUtils"
import { ChessRepertoire } from "../../../types/Repertoire"
import { promises as fs } from "fs"
import path from "path"


export async function readRepertoiresFromJson(): Promise<any[]> {
  const modelsDirectory = path.join(process.cwd(), "resources/repertoires")
  const filenames = await fs.readdir(modelsDirectory)

  const repertoires = filenames.map(async (filename) => {
    const filePath = path.join(modelsDirectory, filename)
    const fileContents = await fs.readFile(filePath, "utf8")

    // Generally you would parse/transform the contents
    // For example you can transform markdown to HTML here
    let repertoire = JSON.parse(fileContents)
    repertoires[repertoire.id] = repertoire
    return repertoire
  })
  // By returning { props: { modelsDescriptions } }, the Blog component
  // will receive `modelsDescriptions` as a prop at build time
  return Promise.all(repertoires)
}

export async function readSuggestionsFromJson(): Promise<any[]> {
  const modelsDirectory = path.join(process.cwd(), "resources/suggestions")
  const filenames = await fs.readdir(modelsDirectory)

  const suggestions = filenames.map(async (filename) => {
    const filePath = path.join(modelsDirectory, filename)
    const fileContents = await fs.readFile(filePath, "utf8")

    // Generally you would parse/transform the contents
    // For example you can transform markdown to HTML here
    let suggestion = JSON.parse(fileContents)
    return suggestion
  })
  // By returning { props: { modelsDescriptions } }, the Blog component
  // will receive `modelsDescriptions` as a prop at build time
  return Promise.all(suggestions)
}

export async function readRepertoiresFromJsonToIndex(): Promise<
  Map<string, ChessRepertoire>
> {
  let repertoires = await readRepertoiresFromJson()
  return createRepertoireIndexFromRepertoireArray(repertoires)
}

export async function readSuggestionsFromJsonToRepertoire(): Promise<ChessRepertoire> {
  let suggestions = await readSuggestionsFromJson()
  return createSuggestionsRepertoireFromSuggestionArray(suggestions[0])
}
