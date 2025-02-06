import { Reply } from '@/entities/session';

import { Button } from '@/shared/ui/button';
import { useModalContext } from '@/shared/ui/modal';
import { useToastStore } from '@/shared/ui/toast';

interface CreateReplyModalFooterProps {
  reply?: Reply;
  buttonEnabled: boolean;
  handleSubmit: () => void;
}

export default function CreateReplyModalFooter({
  reply,
  buttonEnabled,
  handleSubmit,
}: Readonly<CreateReplyModalFooterProps>) {
  const { closeModal } = useModalContext();

  const addToast = useToastStore((state) => state.addToast);

  return (
    <footer className='flex h-[3rem] flex-row items-end justify-between'>
      <div className='flex flex-row gap-2'>
        <Button
          className={`${buttonEnabled ? 'bg-indigo-600' : 'cursor-not-allowed bg-indigo-300'}`}
          onClick={() => {
            if (buttonEnabled) {
              addToast({
                type: 'INFO',
                message: '추후 업데이트 예정입니다.',
                duration: 3000,
              });
            }
          }}
        >
          <div className='text-sm font-bold text-white'>답변 개선하기</div>
        </Button>
        <Button
          className={`${buttonEnabled ? 'bg-indigo-600' : 'cursor-not-allowed bg-indigo-300'}`}
          onClick={() => {
            if (buttonEnabled) {
              addToast({
                type: 'INFO',
                message: '추후 업데이트 예정입니다.',
                duration: 3000,
              });
            }
          }}
        >
          <div className='text-sm font-bold text-white'>답변 축약하기</div>
        </Button>
      </div>
      <div className='flex flex-row gap-2'>
        <Button className='bg-gray-500' onClick={closeModal}>
          <div className='text-sm font-bold text-white'>취소하기</div>
        </Button>
        <Button
          className={`${buttonEnabled ? 'bg-indigo-600' : 'cursor-not-allowed bg-indigo-300'}`}
          onClick={() => {
            if (buttonEnabled) handleSubmit();
          }}
        >
          <div className='text-sm font-bold text-white'>{reply ? '수정하기' : '생성하기'}</div>
        </Button>
      </div>
    </footer>
  );
}
