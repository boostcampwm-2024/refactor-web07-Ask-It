import { Question } from '@/entities/session';

import { Button } from '@/shared/ui/button';
import { useModalContext } from '@/shared/ui/modal';

interface CreateQuestionModalFooterProps {
  supportResult: string | null;
  question?: Question;
  isValidLength: boolean;
  buttonEnabled: boolean;
  handleQuestionImprovement: () => void;
  handleQuestionShortening: () => void;
  handleCreateOrUpdate: () => void;
  handleRetry: () => void;
  accept: () => void;
  reject: () => void;
}

export default function CreateQuestionModalFooter({
  supportResult,
  question,
  isValidLength,
  buttonEnabled,
  handleQuestionImprovement,
  handleQuestionShortening,
  handleCreateOrUpdate,
  handleRetry,
  accept,
  reject,
}: Readonly<CreateQuestionModalFooterProps>) {
  const { closeModal } = useModalContext();

  return (
    <footer className='flex h-[3rem] flex-row items-end justify-between'>
      {supportResult === null ? (
        <>
          <div className='flex flex-row gap-2'>
            <Button
              className={`${buttonEnabled && isValidLength ? 'bg-indigo-600' : 'cursor-not-allowed bg-indigo-300'}`}
              onClick={handleQuestionImprovement}
            >
              <div className='text-sm font-bold text-white'>질문 개선하기</div>
            </Button>
            <Button
              className={`${buttonEnabled ? 'bg-indigo-600' : 'cursor-not-allowed bg-indigo-300'}`}
              onClick={handleQuestionShortening}
            >
              <div className='text-sm font-bold text-white'>질문 축약하기</div>
            </Button>
          </div>
          <div className='flex flex-row gap-2'>
            <Button className='bg-gray-500' onClick={closeModal}>
              <div className='text-sm font-bold text-white'>취소하기</div>
            </Button>
            <Button
              className={`${buttonEnabled && isValidLength ? 'bg-indigo-600' : 'cursor-not-allowed bg-indigo-300'}`}
              onClick={handleCreateOrUpdate}
            >
              <div className='text-sm font-bold text-white'>{question ? '수정하기' : '생성하기'}</div>
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className='flex flex-row gap-2'>
            <Button className='bg-gray-500' onClick={reject}>
              <div className='text-sm font-bold text-white'>취소하기</div>
            </Button>
            <Button className='bg-gray-500' onClick={handleRetry}>
              <div className='text-sm font-bold text-white'>다시 요청하기</div>
            </Button>
            <Button className='bg-indigo-600' onClick={accept}>
              <div className='text-sm font-bold text-white'>사용하기</div>
            </Button>
          </div>
        </>
      )}
    </footer>
  );
}
