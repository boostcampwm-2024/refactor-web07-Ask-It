import { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import Background from '@/features/modal/Background';
import { ModalContext } from '@/features/modal/modal.context';

export const useModal = (children: ReactNode) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
    setIsClosing(false);
  }, []);

  const closeModal = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => setIsOpen(false), 150);
  }, []);

  const Modal = useMemo(() => {
    if (!isOpen) return null;
    return createPortal(
      <ModalContext.Provider value={{ openModal, closeModal }}>
        <Background>
          <div className={`modal-content ${isClosing ? 'animate-modalClose' : 'animate-modalOpen'}`}>{children}</div>
        </Background>
      </ModalContext.Provider>,
      document.body,
    );
  }, [isOpen, openModal, closeModal, isClosing, children]);

  return useMemo(
    () => ({
      Modal,
      openModal,
      closeModal,
    }),
    [Modal, openModal, closeModal],
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};
