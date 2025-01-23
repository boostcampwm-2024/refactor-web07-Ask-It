import { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { createContext } from 'react';
import { PropsWithChildren, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface ModalContextProps {
  openModal: () => void;
  closeModal: () => void;
}

export const ModalContext = createContext<ModalContextProps | undefined>(undefined);

function Background({ children }: PropsWithChildren) {
  const { closeModal } = useModalContext();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [closeModal]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) closeModal();
      }}
      onKeyDown={(e) => e.stopPropagation()}
      onFocus={(e) => e.stopPropagation()}
      onMouseOver={(e) => e.stopPropagation()}
      className='fixed left-0 top-0 z-10 flex h-dvh w-dvw cursor-auto items-center justify-center bg-[#808080]/20 backdrop-blur-sm'
    >
      {children}
    </div>
  );
}

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
