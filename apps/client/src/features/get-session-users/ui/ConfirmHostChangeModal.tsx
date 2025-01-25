import { User } from '@/entities/session';

import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';

interface ConfirmHostChangeModalProps {
  user: User;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmHostChangeModal({ user, onCancel, onConfirm }: Readonly<ConfirmHostChangeModalProps>) {
  return (
    <Modal className='h-[10dvh] w-[30dvw] min-w-[30dvw]'>
      <Modal.Body className='justify-center'>
        <div className='w-full text-center font-bold'>
          <span>
            <span className='text-indigo-600'>{user.nickname}</span>
            <span>님을</span>
          </span>
          <br />
          <span>{user.isHost ? '호스트를 해제하겠습니까?' : '호스트로 지정하겠습니까?'}</span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='w-full bg-gray-500' onClick={onCancel}>
          <div className='flex-grow text-sm font-medium text-white'>취소하기</div>
        </Button>
        <Button className='w-full bg-indigo-600 transition-colors duration-200' onClick={onConfirm}>
          <div className='flex-grow text-sm font-medium text-white'>{user.isHost ? '해제하기' : '지정하기'}</div>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmHostChangeModal;
