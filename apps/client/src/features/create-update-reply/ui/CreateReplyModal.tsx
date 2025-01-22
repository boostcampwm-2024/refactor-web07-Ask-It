import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { useShallow } from 'zustand/react/shallow';

import { postReply } from '@/features/create-update-reply/api/create-reply.api';
import { patchReplyBody } from '@/features/create-update-reply/api/update-reply.api';

import { Question, Reply, useSessionStore } from '@/entities/session';
import { Button } from '@/shared/ui/button';
import { useModalContext } from '@/shared/ui/modal';
import { useToastStore } from '@/shared/ui/toast';

interface CreateReplyModalProps {
  question?: Question;
  reply?: Reply;
}

const useReplyMutation = (question?: Question, reply?: Reply) => {
  const { closeModal } = useModalContext();
  const addToast = useToastStore((state) => state.addToast);

  const { sessionToken, sessionId, expired, addReply, updateReply } = useSessionStore(
    useShallow((state) => ({
      sessionToken: state.sessionToken,
      sessionId: state.sessionId,
      expired: state.expired,
      addReply: state.addReply,
      updateReply: state.updateReply,
    })),
  );

  const [body, setBody] = useState('');

  const { mutate: postReplyQuery, isPending: isPostInProgress } = useMutation({
    mutationFn: postReply,
    onSuccess: (res) => {
      if (!reply && question) {
        addReply(question.questionId, {
          ...res.reply,
          userId: null,
          deleted: false,
        });
        addToast({
          type: 'SUCCESS',
          message: '답변이 성공적으로 등록되었습니다.',
          duration: 3000,
        });
        closeModal();
      }
    },
    onError: console.error,
  });

  const { mutate: patchReplyBodyQuery, isPending: isPatchInProgress } = useMutation({
    mutationFn: (params: { replyId: number; token: string; sessionId: string; body: string }) =>
      patchReplyBody(params.replyId, {
        token: params.token,
        sessionId: params.sessionId,
        body: params.body,
      }),
    onSuccess: (res) => {
      if (reply && question) {
        updateReply(question.questionId, res.reply);
        addToast({
          type: 'SUCCESS',
          message: '답변이 성공적으로 수정되었습니다.',
          duration: 3000,
        });
        closeModal();
      }
    },
    onError: console.error,
  });

  const submitDisabled =
    expired || body.trim().length === 0 || !sessionId || !sessionToken || isPostInProgress || isPatchInProgress;

  const handleSubmit = () => {
    if (submitDisabled) return;

    if (!reply && question) {
      postReplyQuery({
        sessionId,
        token: sessionToken,
        questionId: question?.questionId,
        body,
      });
    } else if (reply && question) {
      patchReplyBodyQuery({
        replyId: reply.replyId,
        token: sessionToken,
        sessionId,
        body,
      });
    }
  };

  useEffect(() => {
    if (reply) setBody(reply.body);
  }, [reply]);

  return { body, setBody, handleSubmit, submitDisabled };
};

const ModalHeader = () => (
  <header>
    <h2 className='text-lg font-semibold text-black'>답변하기</h2>
  </header>
);

const QuestionPreview = ({ question }: { question?: Question }) => {
  if (!question) return null;

  return (
    <div className='max-h-[20dvh] overflow-y-auto border-gray-200 py-2'>
      <Markdown className='prose prose-stone'>{question.body}</Markdown>
    </div>
  );
};

const ContentEditor = ({ body, setBody }: { body: string; setBody: (value: string) => void }) => (
  <div className='flex h-full gap-2.5'>
    <textarea
      className='h-full flex-1 resize-none rounded border p-4 focus:outline-none'
      value={body}
      onChange={(e) => setBody(e.target.value)}
      placeholder={`**답변을 남겨주세요**\n**(마크다운 지원)**`}
    />
    <div className='flex-1 overflow-y-auto rounded border p-4'>
      <Markdown className='prose prose-stone'>
        {body.length === 0 ? `**답변을 남겨주세요**\n\n**(마크다운 지원)**` : body}
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

function CreateReplyModal({ question, reply }: CreateReplyModalProps) {
  const { closeModal } = useModalContext();
  const { body, setBody, handleSubmit, submitDisabled } = useReplyMutation(question, reply);

  return (
    <div className='flex h-[50dvh] w-[50dvw] flex-col gap-2 rounded-lg bg-gray-50 p-8'>
      <ModalHeader />
      <hr className='my-1 border-gray-200' />
      <QuestionPreview question={question} />
      <hr className='my-1 border-gray-200' />
      <ContentEditor body={body} setBody={setBody} />
      <ModalFooter
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitDisabled={submitDisabled}
        submitText={reply ? '수정하기' : '생성하기'}
      />
    </div>
  );
}

export default CreateReplyModal;
