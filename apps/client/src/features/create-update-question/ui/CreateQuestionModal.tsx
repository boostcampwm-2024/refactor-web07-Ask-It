import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { useShallow } from 'zustand/react/shallow';

import { postQuestion } from '@/features/create-update-question/api/create-question.api';
import { patchQuestionBody } from '@/features/create-update-question/api/update-question.api';

import { Question, useSessionStore } from '@/entities/session';
import { Button } from '@/shared/ui/button';
import { useModalContext } from '@/shared/ui/modal';
import { useToastStore } from '@/shared/ui/toast';

interface CreateQuestionModalProps {
  question?: Question;
}

const useQuestionMutation = (question?: Question) => {
  const { closeModal } = useModalContext();
  const addToast = useToastStore((state) => state.addToast);

  const { sessionId, sessionToken, expired, addQuestion, updateQuestion } = useSessionStore(
    useShallow((state) => ({
      sessionId: state.sessionId,
      sessionToken: state.sessionToken,
      expired: state.expired,
      addQuestion: state.addQuestion,
      updateQuestion: state.updateQuestion,
    })),
  );

  const [body, setBody] = useState('');

  const { mutate: postQuestionQuery, isPending: isPostInProgress } = useMutation({
    mutationFn: postQuestion,
    onSuccess: (response) => {
      addQuestion(response.question);
      addToast({
        type: 'SUCCESS',
        message: '질문이 성공적으로 등록되었습니다.',
        duration: 3000,
      });
      closeModal();
    },
    onError: console.error,
  });

  const { mutate: patchQuestionBodyQuery, isPending: isPatchInProgress } = useMutation({
    mutationFn: (params: { questionId: number; token: string; sessionId: string; body: string }) =>
      patchQuestionBody(params.questionId, {
        token: params.token,
        sessionId: params.sessionId,
        body: params.body,
      }),
    onSuccess: (response) => {
      updateQuestion(response.question);
      addToast({
        type: 'SUCCESS',
        message: '질문이 성공적으로 수정되었습니다.',
        duration: 3000,
      });
      closeModal();
    },
    onError: console.error,
  });

  const submitDisabled =
    expired || body.trim().length === 0 || !sessionId || !sessionToken || isPostInProgress || isPatchInProgress;

  const handleSubmit = () => {
    if (submitDisabled) return;

    if (!question) {
      postQuestionQuery({
        token: sessionToken,
        sessionId,
        body,
      });
    } else {
      patchQuestionBodyQuery({
        questionId: question.questionId,
        token: sessionToken,
        sessionId,
        body,
      });
    }
  };

  useEffect(() => {
    if (question) setBody(question.body);
  }, [question]);

  return { body, setBody, handleSubmit, submitDisabled };
};

const ModalHeader = () => (
  <header>
    <h2 className='text-lg font-semibold text-black'>질문하기</h2>
  </header>
);

const ContentEditor = ({ body, setBody }: { body: string; setBody: (value: string) => void }) => (
  <div className='flex h-full gap-2.5'>
    <textarea
      className='h-full flex-1 resize-none rounded border p-4 focus:outline-none'
      value={body}
      onChange={(e) => setBody(e.target.value)}
      placeholder={`**질문을 남겨주세요**\n**(마크다운 지원)**`}
    />
    <div className='flex-1 overflow-y-auto rounded border p-4'>
      <Markdown className='prose prose-stone'>
        {body.length === 0 ? `**질문을 남겨주세요**\n\n**(마크다운 지원)**` : body}
      </Markdown>
    </div>
  </div>
);

const ModalFooter = ({
  onClose,
  onSubmit,
  submitDisabled,
  submitText,
}: {
  onClose: () => void;
  onSubmit: () => void;
  submitDisabled: boolean;
  submitText: string;
}) => (
  <footer className='flex justify-end gap-2.5'>
    <Button className='bg-gray-500' onClick={onClose}>
      <div className='text-sm font-bold text-white'>취소하기</div>
    </Button>
    <Button className={`${!submitDisabled ? 'bg-indigo-600' : 'cursor-not-allowed bg-indigo-300'}`} onClick={onSubmit}>
      <div className='text-sm font-bold text-white'>{submitText}</div>
    </Button>
  </footer>
);

function CreateQuestionModal({ question }: CreateQuestionModalProps) {
  const { closeModal } = useModalContext();
  const { body, setBody, handleSubmit, submitDisabled } = useQuestionMutation(question);

  return (
    <div className='flex h-[50dvh] w-[50dvw] flex-col gap-2 rounded-lg bg-gray-50 p-8'>
      <ModalHeader />
      <hr className='my-1 border-gray-200' />
      <ContentEditor body={body} setBody={setBody} />
      <ModalFooter
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitDisabled={submitDisabled}
        submitText={question ? '수정하기' : '생성하기'}
      />
    </div>
  );
}

export default CreateQuestionModal;
