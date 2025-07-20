import { useChessProvider } from "@/features/chess/logic/providers/ChessProvider"
import { useRepertoireProvider } from "@/features/repertoire/providers/RepertoireProvider"
import { getLastMove } from "@/features/chess/logic/utils/moveUtils"
import { computeSunburstDataFromPosition } from "@/features/chess/sunburst/utils/sunburstUtils"
import { useCallback, useRef, useState, useEffect } from "react"
import { ChessRepertoire } from "../../../../types/Repertoire"
import { ChessMove } from "../../../../types/ChessMove"

export function useSunburst() {
  const { chess, getFen } = useChessProvider()
  const { repertoire, repertoireVersion } = useRepertoireProvider()

  let lastMove = getLastMove(chess)

  const suggestion = new ChessRepertoire(
    "0",
    "0",
    "w",
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  )

  // ✅ Initialize as null instead of computing immediately
  const [sunBurstData, setSunBurstData] = useState(null)
  const prevDataRef = useRef(null)

  // ✅ Compute sunburst data when repertoire is available
  useEffect(() => {
    if (repertoire.current) {
      const data = computeSunburstDataFromPosition(
        repertoire.current,
        suggestion,
        getFen(),
        lastMove,
        1,
      )
      setSunBurstData(data)
    }
  }, [repertoire.current, repertoireVersion, getFen]) // Re-compute when repertoire or version changes

  const updateSunburstData = useCallback(
    (fen: string, lastMove?: ChessMove) => {
      // ✅ Only update if repertoire is available
      if (!repertoire.current) return

      if (!lastMove) {
        let lm = getLastMove(chess)
        if (lm !== null) {
          lm.nextFen = getFen()
          lastMove = lm
        }
      }

      prevDataRef.current = sunBurstData
      setSunBurstData(
        computeSunburstDataFromPosition(
          repertoire.current,
          suggestion,
          fen,
          lastMove,
          1,
        ),
      )
    },
    [chess, repertoire, suggestion, repertoireVersion, sunBurstData, getFen],
  )

  return {
    sunBurstData,
    prevSunBurstData: prevDataRef.current,
    updateSunburstData,
  }
}
