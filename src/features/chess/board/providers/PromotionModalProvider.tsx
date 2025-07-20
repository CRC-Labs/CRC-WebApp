import { createContext, useState } from "react"

export const PromotionModalContext = createContext(undefined)

export default function PromotionModalProvider({ children }) {
  const [promotionModalState, setPromotionModalState] = useState({
    isOpen: false,
    onPromotionSelect: undefined,
    color: "w",
    destinationColumn: "e",
    repertoireColor: "w",
  })

  return (
    <PromotionModalContext.Provider
      value={{ promotionModalState, setPromotionModalState }}
    >
      {children}
    </PromotionModalContext.Provider>
  )
}
