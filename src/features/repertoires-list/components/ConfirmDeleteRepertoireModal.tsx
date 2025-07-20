import Modal from "@/features/modals/components/Modal"
import ModalFooterButtonBar from "@/features/modals/components/ModalFooterButtonBar"

function ConfirmDeleteRepertoireModal({
  isOpen,
  cancelFunc,
  rid,
  name,
  deleteRepertoire,
}) {
  function onSubmit() {
    deleteRepertoire(rid)
    cancelFunc()
    return false
  }

  return (
    <Modal title="Delete Repertoire" onClose={cancelFunc} isOpen={isOpen}>
      <section className="flex h-full flex-col items-center rounded-2xl bg-stone-300 px-4 text-lg dark:bg-stone-900 sm:max-w-[80vw] sm:px-8">
        <header className="text-gray-500 dark:text-gray-400">
          Are you sure that you want to delete repertoire {name} ?
        </header>
        <ModalFooterButtonBar
          cancelFunc={cancelFunc}
          onSubmit={onSubmit}
          okLabel="Delete"
          cancelLabel={"Cancel"}
        />
      </section>
    </Modal>
  )
}

export default ConfirmDeleteRepertoireModal
