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
    requestEnable,
    setSupportType,
    replyImprovement,
    retryReplyImprovement,
    accept,
    reject,
  } = useReplyWritingSupport({ questionBody: question?.body ?? '', body, handleAccept: setBody });

  const [contentType, setContentType] = useState<ContentType>('reply');

  const bodyLength = getContentBodyLength(supportResult ?? body);
  const isValidLength = isValidBodyLength(bodyLength);

  const buttonEnabled = !submitDisabled && isValidLength && contentType !== 'question';

  const handleCreateOrUpdate = () => {
    if (buttonEnabled && isValidLength) handleSubmit();
  };

  const handleReplyImprovement = () => {
    if (buttonEnabled && isValidLength && question && sessionId && token) {
      setSupportType('IMPROVE_REPLY');
      replyImprovement({ token, sessionId, body, originalQuestion: question.body });
    }
  };

  const handleRetry = (requirements: string) => {
    if (sessionId && token && question && supportResult && supportType) {
      retryReplyImprovement({
        token,
        sessionId,
        originalQuestion: question.body,
        original: body,
        received: supportResult,
        retryMessage: requirements,
      });
    }
  };

  return (
    <div className='relative flex h-[20rem] w-[40rem] flex-col rounded-lg bg-gray-50 p-4'>
      <div className='flex h-[15rem] flex-1 rounded border bg-white'>
        <ReplyContentView
          contentType={contentType}
          questionBody={question?.body ?? '질문을 찾을 수 없습니다.'}
          replyBody={body}
          onReplyBodyChange={setBody}
          supportResult={supportResult}
          isWritingPending={!requestEnable}
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
        handleRetry={handleRetry}
        accept={accept}
        reject={reject}
      />
    </div>
  );
}

export default CreateReplyModal;
