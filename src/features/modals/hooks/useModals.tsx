// hooks/useModals.ts
import { useCallback, useContext } from "react"
import ConflictModal from "@/features/modals/components/ConflictModal"
import { ModalContext } from "@/features/modals/providers/ModalProvider"
import { getWidthAndHeight } from "@/features/common/utils/helpers"

export function useModals() {
  const { modalState, setModalState } = useContext(ModalContext)
  const [width, height] = getWidthAndHeight()

  const openConflictModal = useCallback(
    (oldMove, newMove, onKeepOriginal, onReplaceMove, repertoireColor) => {
      setModalState({
        isOpen: true,
        content: (
          <ConflictModal
            oldMove={oldMove}
            newMove={newMove}
            repertoireColor={repertoireColor}
            onKeepOriginal={() => {
              onKeepOriginal()
              closeModal()
            }}
            onReplaceMove={() => {
              onReplaceMove()
              closeModal()
            }}
            width={width}
            height={height}
          />
        ),
      })
    },
    [width, height],
  )

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      content: null,
    })
  }, [])

  return {
    isModalOpen: modalState.isOpen,
    modalContent: modalState.content,
    setModalState,
    closeModal,
    openConflictModal,
  }
}
