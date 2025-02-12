import { useState } from 'react';

import { Question } from '@/entities/session';

import { Button } from '@/shared/ui/button';
import { useModalContext } from '@/shared/ui/modal';

interface CreateQuestionModalFooterProps {
  supportResult: string | null;
  question?: Question;
  isValidLength: boolean;
  buttonEnabled: boolean;
  handleQuestionImprovement: () => void;
  handleCreateOrUpdate: () => void;
  handleRetry: (requirements: string) => void;
  accept: () => void;
  reject: () => void;
}

function RetryActions({
  handleRetry,
  reject,
  accept,
}: Readonly<{
  handleRetry: (requirements: string) => void;
  reject: () => void;
  accept: () => void;
}>) {
  const [retryEnabled, setRetryEnabled] = useState<boolean>(false);
  const [retryRequirements, setRetryRequirements] = useState<string>('');

  if (retryEnabled) {
    return (
      <div className='flex w-full flex-row gap-2'>
        <input
          className={`w-full resize-none overflow-auto rounded-sm border bg-white px-4 ${retryRequirements ? 'text-base' : 'text-sm'} focus:outline-none`}
          placeholder='추가 요청 내용을 입력해주세요.'
          value={retryRequirements}
          onChange={(e) => setRetryRequirements(e.target.value)}
        />
        <Button
          className='shrink-0 bg-gray-500'
          onClick={() => {
            setRetryEnabled(false);
            setRetryRequirements('');
          }}
        >
          <div className='text-sm font-bold text-white'>취소하기</div>
        </Button>
        <Button className='shrink-0 bg-indigo-600' onClick={() => handleRetry(retryRequirements)}>
          <div className='text-sm font-bold text-white'>요청하기</div>
        </Button>
      </div>
    );
  }

  return (
    <div className='flex flex-row gap-2'>
      <Button className='bg-gray-500' onClick={reject}>
        <div className='text-sm font-bold text-white'>취소하기</div>
      </Button>
      <Button className='bg-gray-500' onClick={() => setRetryEnabled(true)}>
        <div className='text-sm font-bold text-white'>다시 요청하기</div>
      </Button>
      <Button className='bg-indigo-600' onClick={accept}>
        <div className='text-sm font-bold text-white'>사용하기</div>
      </Button>
    </div>
  );
}

export default function CreateQuestionModalFooter({
  supportResult,
  question,
  isValidLength,
  buttonEnabled,
  handleQuestionImprovement,
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
          <Button
            className={`${buttonEnabled && isValidLength ? 'bg-indigo-600' : 'cursor-not-allowed bg-indigo-300'}`}
            onClick={handleQuestionImprovement}
          >
            <div className='text-sm font-bold text-white'>질문 개선하기</div>
          </Button>
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
        <RetryActions handleRetry={handleRetry} reject={reject} accept={accept} />
      )}
    </footer>
  );
}
