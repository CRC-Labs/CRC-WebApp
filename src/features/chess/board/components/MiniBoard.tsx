import React, { useEffect } from "react"

import { Chessground as ChessgroundApi } from "chessground"
import { Api } from "chessground/api"

function MiniBoard({ fen, orientation }) {
  const ref = React.useRef<HTMLDivElement>(null)

  const boardApi = React.useRef<Api | null>(null)

  useEffect(() => {
    if (ref && ref.current && !boardApi.current) {
      const chessgroundApi = ChessgroundApi(ref.current, {
        fen: fen,
        viewOnly: true,
        coordinates: false,
        orientation: orientation,
      })
      boardApi.current = chessgroundApi
    }
  }, [fen, orientation, ref])

  return (
    <div
      style={{
        height: "136px",
        width: "136px",
      }}
      ref={ref}
    />
  )
}

export default MiniBoard
