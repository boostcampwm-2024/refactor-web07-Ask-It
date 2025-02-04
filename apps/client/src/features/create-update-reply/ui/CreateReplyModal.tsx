import { useState } from 'react';

import { ContentType } from '@/features/create-update-reply/model/reply-modal.type';
import { useReplyMutation } from '@/features/create-update-reply/model/useReplyMutation';
import ReplyContentView from '@/features/create-update-reply/ui/ReplyContentView';

import { Question, Reply } from '@/entities/session';

import { Button } from '@/shared/ui/button';
import { useModalContext } from '@/shared/ui/modal';

interface CreateReplyModalProps {
  question?: Question;
  reply?: Reply;
}

function CreateReplyModal({ question, reply }: Readonly<CreateReplyModalProps>) {
  const { closeModal } = useModalContext();
  const { body, setBody, handleSubmit, submitDisabled } = useReplyMutation(question, reply);

  const [contentType, setContentType] = useState<ContentType>('reply');

  return (
    <div className='flex h-[20rem] w-[40rem] flex-col gap-2 rounded-lg bg-gray-50 p-4'>
      <ReplyContentView
        contentType={contentType}
        questionBody={question?.body ?? '질문을 찾을 수 없습니다.'}
        replyBody={body}
        onChange={setBody}
      />
      <footer className='flex h-[3rem] flex-row items-end justify-between'>
        <div className='flex flex-row gap-2'>
          <Button className='bg-indigo-600'>
            <div className='text-sm font-bold text-white'>답변 개선하기</div>
          </Button>
          <Button className='bg-indigo-600'>
            <div className='text-sm font-bold text-white'>답변 축약하기</div>
          </Button>
          {(contentType === 'reply' || contentType === 'question') && (
            <Button
              className='bg-gray-500'
              onClick={() => setContentType((prev) => (prev !== 'question' ? 'question' : 'reply'))}
            >
              <div className='text-sm font-bold text-white'>{contentType === 'reply' ? '질문보기' : '답변하기'}</div>
            </Button>
          )}
          {(contentType === 'reply' || contentType === 'preview') && (
            <Button
              className='bg-gray-500'
              onClick={() => setContentType((prev) => (prev !== 'preview' ? 'preview' : 'reply'))}
            >
              <div className='text-sm font-bold text-white'>{contentType === 'reply' ? '미리보기' : '답변하기'}</div>
            </Button>
          )}
        </div>
        <div className='flex flex-row gap-2'>
          <Button className='bg-gray-500' onClick={closeModal}>
            <div className='text-sm font-bold text-white'>취소하기</div>
          </Button>
          <Button
            className={`${!submitDisabled ? 'bg-indigo-600' : 'cursor-not-allowed bg-indigo-300'}`}
            onClick={handleSubmit}
          >
            <div className='text-sm font-bold text-white'>생성하기</div>
          </Button>
        </div>
      </footer>
    </div>
  );
}

export default CreateReplyModal;
