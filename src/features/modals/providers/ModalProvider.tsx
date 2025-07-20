import { createContext, useState } from "react";
import Modal from "../components/Modal";

export const ModalContext = createContext(undefined);

export function ModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title:null,
    content: null
  });

  return (
    <ModalContext.Provider value={{ modalState, setModalState }}>
      {children}
      <Modal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        title={modalState.title}
      >
        {modalState.content}
      </Modal>
    </ModalContext.Provider>
  );
}