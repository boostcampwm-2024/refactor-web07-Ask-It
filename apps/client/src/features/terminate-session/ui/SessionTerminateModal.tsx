import { Button } from '@/shared/ui/button';
import { Modal, useModalContext } from '@/shared/ui/modal';

interface SessionTerminateModalProps {
  onCancel?: () => void;
  onConfirm?: () => void;
}

function SessionTerminateModal({ onCancel, onConfirm }: SessionTerminateModalProps) {
  const { closeModal } = useModalContext();

  return (
    <Modal className='h-[10dvh] w-[30dvw] min-w-[30dvw]'>
      <Modal.Body>
        <div className='w-full text-center font-bold'>
          <span>정말 세션을 종료하시겠습니까?</span>
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
          <span className='flex-grow text-sm font-medium text-white'>종료하기</span>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SessionTerminateModal;
