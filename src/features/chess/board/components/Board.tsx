import React, { useContext, useEffect } from "react"

import { Chessground as ChessgroundApi } from "chessground"

import { useBoardProvider } from "../providers/BoardProvider"
import PromotionModal from "./PromotionModal"
import { PromotionModalContext } from "../providers/PromotionModalProvider"
import { useRepertoireProvider } from "@/features/repertoire/providers/RepertoireProvider"

function Board({ config, afterMoveFunc }) {
  const { ref, boardApi } = useBoardProvider()
  const { promotionModalState, setPromotionModalState } = useContext(
    PromotionModalContext,
  )
  const { mode } = useRepertoireProvider()

  useEffect(() => {
    if (ref?.current && config) {
      // Check if we need to reinitialize
      const needsReinit =
        !boardApi.current ||
        !ref.current.hasChildNodes() ||
        ref.current.innerHTML.length === 0

      if (needsReinit) {
        // Clean up existing instance
        if (boardApi.current) {
          try {
            boardApi.current.destroy()
          } catch (e) {}
          boardApi.current = null
        }

        // Create fresh instance
        const chessgroundApi = ChessgroundApi(ref.current, {
          animation: { enabled: true, duration: 200 },
          ...config,
        })
        boardApi.current = chessgroundApi
      } else {
        // Just update existing instance
        boardApi.current.set(config)
      }
    }
  }, [ref, config, mode])

  useEffect(() => {
    boardApi.current?.set({
      movable: {
        events: {
          after: afterMoveFunc,
        },
      },
    })
  }, [afterMoveFunc, boardApi])

  useEffect(() => {
    boardApi.current?.set(config)
  }, [boardApi, config])

  return (
    <>
      {promotionModalState.isOpen && (
        <PromotionModal
          onClose={() => {
            setPromotionModalState({
              isOpen: false,
              onPromotionSelect: undefined,
              color: "w",
            })
            boardApi.current?.set(config)
          }}
          onPromotionSelect={promotionModalState.onPromotionSelect}
          color={promotionModalState.color}
          destinationColumn={promotionModalState.destinationColumn}
          repertoireColor={promotionModalState.repertoireColor}
        />
      )}
      <div className="h-full w-full" ref={ref} />
    </>
  )
}

export default Board
