import { useState } from 'react';

import { ContentType } from '@/features/create-update-reply/model/reply-modal.type';
import { useReplyMutation } from '@/features/create-update-reply/model/useReplyMutation';
import { useReplyWritingSupport } from '@/features/create-update-reply/model/useReplyWritingSupport';
import CreateReplyModalFooter from '@/features/create-update-reply/ui/CreateReplyModalFooter';
import CreateReplyModalSide from '@/features/create-update-reply/ui/CreateReplyModalSide';
import ReplyContentView from '@/features/create-update-reply/ui/ReplyContentView';

import { Question, Reply, useSessionStore } from '@/entities/session';
import { getContentBodyLength, isValidBodyLength } from '@/entities/session/model/qna.util';

interface CreateReplyModalProps {
  question?: Question;
  reply?: Reply;
}

function CreateReplyModal({ question, reply }: Readonly<CreateReplyModalProps>) {
  const token = useSessionStore((state) => state.sessionToken);
  const sessionId = useSessionStore((state) => state.sessionId);

  const { body, setBody, handleSubmit, submitDisabled } = useReplyMutation(question, reply);
  const {
    supportType,
    supportResult,
    isPending,
    setSupportType,
    replyImprovement,
    retryReplyImprovement,
    accept,
    reject,
  } = useReplyWritingSupport({ questionBody: question?.body ?? '', body, handleAccept: setBody });

  const [isAnimationBlocked, setIsAnimationBlocked] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(true);

  const [contentType, setContentType] = useState<ContentType>('reply');

  const bodyLength = getContentBodyLength(supportResult ?? body);
  const isValidLength = isValidBodyLength(bodyLength);

  const buttonEnabled = !submitDisabled && isValidLength && contentType !== 'question' && isAnimationComplete;

  const handleCreateOrUpdate = () => {
    if (buttonEnabled && isValidLength) handleSubmit();
  };

  const handleReplyImprovement = () => {
    if (buttonEnabled && isValidLength && question && sessionId && token) {
      setSupportType('IMPROVE_REPLY');
      setIsAnimationComplete(false);
      replyImprovement({ token, sessionId, body, originalQuestion: question.body }, () => setIsAnimationComplete(true));
    }
  };

  const handleRetry = (requirements: string) => {
    if (sessionId && token && question && supportResult && supportType) {
      setIsAnimationComplete(false);
      retryReplyImprovement(
        {
          token,
          sessionId,
          originalQuestion: question.body,
          original: body,
          received: supportResult,
          retryMessage: requirements,
        },
        () => setIsAnimationComplete(true),
      );
    }
  };

  return (
    <div className='relative flex h-[20rem] w-[40rem] flex-col rounded-lg bg-gray-50 p-4'>
      <div className='flex h-[15rem] flex-1 rounded border bg-white'>
        <ReplyContentView
          isAnimationBlocked={isAnimationBlocked}
          contentType={contentType}
          questionBody={question?.body ?? '질문을 찾을 수 없습니다.'}
          replyBody={body}
          onReplyBodyChange={setBody}
          supportResult={supportResult}
          isWritingPending={isPending && supportResult === null}
          onAnimationComplete={() => {
            setTimeout(() => setIsAnimationBlocked(false), 200);
            setIsAnimationComplete(true);
          }}
        />
        <CreateReplyModalSide bodyLength={bodyLength} contentType={contentType} setContentType={setContentType} />
      </div>
      <CreateReplyModalFooter
        question={question}
        reply={reply}
        buttonEnabled={buttonEnabled}
        supportResult={supportResult}
        handleCreateOrUpdate={handleCreateOrUpdate}
        handleReplyImprovement={handleReplyImprovement}
        handleRetry={(requirements) => {
          setIsAnimationBlocked(false);
          handleRetry(requirements);
        }}
        accept={() => {
          setIsAnimationBlocked(false);
          accept();
        }}
        reject={() => {
          setIsAnimationBlocked(false);
          reject();
        }}
      />
    </div>
  );
}

export default CreateReplyModal;
