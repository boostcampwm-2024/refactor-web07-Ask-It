import { useState } from 'react';

import { Question, Reply } from '@/entities/session';

import { Button } from '@/shared/ui/button';
import { useModalContext } from '@/shared/ui/modal';
import { Popover } from '@/shared/ui/popover';

interface CreateReplyModalFooterProps {
  supportResult: string | null;
  question?: Question;
  reply?: Reply;
  buttonEnabled: boolean;
  handleReplyImprovement: () => void;
  handleRetry: (requirements: string) => void;
  handleCreateOrUpdate: () => void;
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
  const [isRetryRequirementsTooLong, setIsRetryRequirementsTooLong] = useState<boolean>(false);

  const handleChangeRetryRequirements = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 150) {
      setRetryRequirements(value);
      setIsRetryRequirementsTooLong(false);
    } else {
      setIsRetryRequirementsTooLong(true);
    }
  };

  const handleCancelRetry = () => {
    setRetryEnabled(false);
    setRetryRequirements('');
  };

  const handleRetryRequest = () => {
    handleRetry(retryRequirements);
    setRetryEnabled(false);
    setRetryRequirements('');
  };

  if (retryEnabled) {
    return (
      <div className='flex w-full flex-row gap-2'>
        <Popover
          className='w-full flex-1'
          text='요청 사항은 150자를 넘을 수 없습니다.'
          enabled={isRetryRequirementsTooLong}
          position='top-right'
        >
          <input
            className={`h-full w-full resize-none overflow-auto rounded-sm border bg-white px-4 ${retryRequirements ? 'text-base' : 'text-sm'} focus:outline-none`}
            placeholder='추가 요청 내용을 입력해주세요.'
            value={retryRequirements}
            onChange={handleChangeRetryRequirements}
          />
        </Popover>
        <Button className='shrink-0 bg-gray-500' onClick={handleCancelRetry}>
          <div className='text-sm font-bold text-white'>취소하기</div>
        </Button>
        <Button className='shrink-0 bg-indigo-600' onClick={handleRetryRequest}>
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

export default function CreateReplyModalFooter({
  supportResult,
  reply,
  buttonEnabled,
  handleReplyImprovement,
  handleRetry,
  handleCreateOrUpdate,
  accept,
  reject,
}: Readonly<CreateReplyModalFooterProps>) {
  const { closeModal } = useModalContext();

  return (
    <footer className='flex h-[3rem] flex-row items-end justify-between'>
      {supportResult === null ? (
        <>
          <Button
            className={`${buttonEnabled ? 'bg-indigo-600' : 'cursor-not-allowed bg-indigo-300'}`}
            onClick={handleReplyImprovement}
          >
            <div className='text-sm font-bold text-white'>답변 개선하기</div>
          </Button>
          <div className='flex flex-row gap-2'>
            <Button className='bg-gray-500' onClick={closeModal}>
              <div className='text-sm font-bold text-white'>취소하기</div>
            </Button>
            <Button
              className={`${buttonEnabled ? 'bg-indigo-600' : 'cursor-not-allowed bg-indigo-300'}`}
              onClick={handleCreateOrUpdate}
            >
              <div className='text-sm font-bold text-white'>{reply ? '수정하기' : '생성하기'}</div>
            </Button>
          </div>
        </>
      ) : (
        <RetryActions handleRetry={handleRetry} reject={reject} accept={accept} />
      )}
    </footer>
  );
}
