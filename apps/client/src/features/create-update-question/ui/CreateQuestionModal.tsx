import { useState } from 'react';
import Markdown from 'react-markdown';

import { useQuestionMutation } from '@/features/create-update-question/model/useQuestionMutation';

import { Question } from '@/entities/session';

import { Button } from '@/shared/ui/button';
import { useModalContext } from '@/shared/ui/modal';

interface CreateQuestionModalProps {
  question?: Question;
}

function CreateQuestionModal({ question }: Readonly<CreateQuestionModalProps>) {
  const { closeModal } = useModalContext();
  const { body, setBody, handleSubmit, submitDisabled } = useQuestionMutation(question);

  const [openPreview, setOpenPreview] = useState(false);

  return (
    <div className='flex h-[20rem] w-[40rem] flex-col gap-2 rounded-lg bg-gray-50 p-4'>
      {openPreview ? (
        <div className='flex-1 overflow-y-auto rounded border bg-white p-4'>
          <Markdown className='prose prose-stone'>{body}</Markdown>
        </div>
      ) : (
        <textarea
          className='flex-1 resize-none rounded border p-4 focus:outline-none'
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder='질문을 남겨주세요.'
        />
      )}
      <footer className='flex h-[3rem] flex-row items-end justify-between'>
        <div className='flex flex-row gap-2'>
          <Button className='bg-indigo-600'>
            <div className='text-sm font-bold text-white'>질문 개선하기</div>
          </Button>
          <Button className='bg-indigo-600'>
            <div className='text-sm font-bold text-white'>질문 축약하기</div>
          </Button>
          <Button className='bg-gray-500' onClick={() => setOpenPreview(!openPreview)}>
            <div className='text-sm font-bold text-white'>{openPreview ? '작성하기' : '미리보기'}</div>
          </Button>
        </div>
        <div className='flex flex-row gap-2'>
          <Button className='bg-gray-500' onClick={closeModal}>
            <div className='text-sm font-bold text-white'>취소하기</div>
          </Button>
          <Button
            className={`${!submitDisabled ? 'bg-indigo-600' : 'cursor-not-allowed bg-indigo-300'}`}
            onClick={handleSubmit}
          >
            <div className='text-sm font-bold text-white'>{question ? '수정하기' : '생성하기'}</div>
          </Button>
        </div>
      </footer>
    </div>
  );
}

export default CreateQuestionModal;
