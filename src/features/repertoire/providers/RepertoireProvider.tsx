// Import React and other necessary modules
import React, { useCallback, useRef, useState } from "react"

// Import the LoadingScreenWithoutLayout component and the necessary types

// Import the useApi, useAppContext, and useChessProvider hooks
import LoadingScreenWithoutLayout from "@/features/common/components/LoadingScreenWithoutLayout"
import { ChessLine, TranspositionElement } from "../../../types/ChessLine"
import { RepertoireMode, ChessRepertoire } from "../../../types/Repertoire"
import { useRepertoireStoreProvider } from "@/features/repertoires-list/providers/RepertoireStoreProvider"

// Define the interface for the RepertoireProvider component
interface RepertoireProviderInterface {
  mode: RepertoireMode // The current repertoire mode
  setMode: React.Dispatch<React.SetStateAction<RepertoireMode>> // A function to set the current repertoire mode
  isLoading: boolean // A boolean value indicating whether the app is currently loading
  repertoire: React.RefObject<ChessRepertoire> // A reference to the current repertoire
  linesData: ChessLine
  linesIndex: React.RefObject<Map<string, ChessLine>>
  transpositionIndex: React.RefObject<Map<string, TranspositionElement>>
  setLinesData: React.Dispatch<React.SetStateAction<ChessLine>>
  quickTrainPosition: QuickTrainPosition // A reference to saved quicktrainposition
  setQuickTrainPosition: (quickTrainPosition: QuickTrainPosition) => void // A function to set quickTrainPosition
  notifyRepertoireChange: () => void
  repertoireVersion: number
}

interface QuickTrainPosition {
  pgn: string
  name: string
  turn: number
}

// create new context
const Context = React.createContext<RepertoireProviderInterface | null>(null)

export default function RepertoireProvider({ children }) {
  // Define the state and ref variables of the component
  const repertoire = useRef<ChessRepertoire>(null) // A reference to the current repertoire being viewed/edited
  const [linesData, setLinesData] = useState<ChessLine>(null)
  const linesIndex = useRef<Map<string, ChessLine>>(new Map())
  const transpositionIndex = useRef<Map<string, TranspositionElement>>(
    new Map(),
  )
  const [repertoireVersion, setRepertoireVersion] = useState(0)
  const notifyRepertoireChange = useCallback(() => {
    setRepertoireVersion((prev) => prev + 1)
  }, [])

  const { isLoadingRepertoiresList } = useRepertoireStoreProvider()

  const [mode, setMode] = useState(RepertoireMode.BUILD)

  const [quickTrainPosition, setQuickTrainPosition] =
    useState<QuickTrainPosition>({
      pgn: "",
      name: "Starting position",
      turn: 1,
    }) // A state representing the saved quickTrainposition

  return (
    <>
      {isLoadingRepertoiresList ? (
        <LoadingScreenWithoutLayout message="Loading Repertoires..." />
      ) : (
        <Context.Provider
          value={{
            mode,
            setMode,
            isLoading: isLoadingRepertoiresList,
            repertoire,
            linesData,
            linesIndex,
            transpositionIndex,
            setLinesData,
            quickTrainPosition,
            setQuickTrainPosition,
            repertoireVersion,
            notifyRepertoireChange,
          }}
        >
          {children}
        </Context.Provider>
      )}
    </>
  )
}

/**
 * A custom React hook that returns the `Context` object from the `RepertoireProvider` component.
 *
 * @returns The `Context` object from the `RepertoireProvider` component.
 */
export function useRepertoireProvider() {
  return React.useContext(Context)
}
