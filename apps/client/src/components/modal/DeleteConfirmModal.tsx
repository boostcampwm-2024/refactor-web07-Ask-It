import { useModalContext } from '@/features/modal';

import Button from '@/components/Button';
import Modal from '@/components/modal/Modal';

interface DeleteConfirmModalProps {
  onCancel?: () => void;
  onConfirm?: () => void;
}

function DeleteConfirmModal({ onCancel, onConfirm }: DeleteConfirmModalProps) {
  const { closeModal } = useModalContext();

  return (
    <Modal>
      <Modal.Body>
        <div className='w-full text-center font-bold'>
          <span>정말 삭제하시겠습니까?</span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='w-full bg-gray-500'
          onClick={() => {
            onCancel?.();
            closeModal();
          }}
        >
          <span className='flex-grow text-sm font-medium text-white'>취소하기</span>
        </Button>
        <Button
          className='w-full bg-indigo-600 transition-colors duration-200'
          onClick={() => {
            onConfirm?.();
            closeModal();
          }}
        >
          <span className='flex-grow text-sm font-medium text-white'>삭제하기</span>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmModal;
