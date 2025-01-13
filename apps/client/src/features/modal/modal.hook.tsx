import { ReactNode, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import Background from '@/features/modal/Background';
import { ModalContext } from '@/features/modal/modal.context';

export const useModal = (children: ReactNode) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    setIsClosing(false);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => setIsOpen(false), 150);
  };

  const contextValue = useMemo(() => ({ openModal, closeModal }), []);

  const Modal = useMemo(() => {
    if (!isOpen) return null;
    return createPortal(
      <ModalContext.Provider value={contextValue}>
        <Background>
          <div className={`modal-content ${isClosing ? 'animate-modalClose' : 'animate-modalOpen'}`}>{children}</div>
        </Background>
      </ModalContext.Provider>,
      document.body,
    );
  }, [isOpen, isClosing, children, contextValue]);

  return {
    Modal,
    openModal,
    closeModal,
  };
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};
