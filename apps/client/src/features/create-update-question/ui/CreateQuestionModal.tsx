import { useState } from 'react';

import { useQuestionMutation } from '@/features/create-update-question/model/useQuestionMutation';
import { useQuestionWritingSupport } from '@/features/create-update-question/model/useQuestionWritingSupport';
import CreateQuestionModalFooter from '@/features/create-update-question/ui/CreateQuestionModalFooter';
import CreateQuestionModalSide from '@/features/create-update-question/ui/CreateQuestionModalSide';
import QuestionContentView from '@/features/create-update-question/ui/QuestionContentView';

import { Question, useSessionStore } from '@/entities/session';
import { getContentBodyLength, isValidBodyLength } from '@/entities/session/model/qna.util';

interface CreateQuestionModalProps {
  question?: Question;
}

function CreateQuestionModal({ question }: Readonly<CreateQuestionModalProps>) {
  const token = useSessionStore((state) => state.sessionToken);
  const sessionId = useSessionStore((state) => state.sessionId);

  const { body, setBody, handleSubmit, submitDisabled } = useQuestionMutation(question);
  const {
    questionImprovement,
    retryQuestionImprovement,
    supportResult,
    accept,
    reject,
    supportType,
    setSupportType,
    isPending,
  } = useQuestionWritingSupport({
    body,
    handleAccept: setBody,
  });

  const [isAnimationComplete, setIsAnimationComplete] = useState(true);

  const [openPreview, setOpenPreview] = useState(false);

  const bodyLength = getContentBodyLength(supportResult ?? body);

  const isValidLength = isValidBodyLength(bodyLength);

  const buttonEnabled = !submitDisabled && !isPending && isAnimationComplete;

  const handleCreateOrUpdate = () => {
    if (buttonEnabled && isValidLength) handleSubmit();
  };

  const handleQuestionImprovement = () => {
    if (buttonEnabled && isValidLength && sessionId && token) {
      setSupportType('IMPROVE_QUESTION');
      setIsAnimationComplete(false);
      questionImprovement({ token, sessionId, body }, () => setIsAnimationComplete(true));
    }
  };

  const handleRetry = (requirements: string) => {
    if (sessionId && token && supportResult && supportType) {
      setIsAnimationComplete(false);
      retryQuestionImprovement(
        {
          token,
          sessionId,
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
        <QuestionContentView
          supportResult={supportResult}
          questionBody={body}
          openPreview={openPreview}
          isWritingPending={isPending && supportResult === null}
          onQuestionBodyChange={setBody}
          onAnimationComplete={() => setIsAnimationComplete(true)}
        />
        <CreateQuestionModalSide bodyLength={bodyLength} openPreview={openPreview} setOpenPreview={setOpenPreview} />
      </div>
      <CreateQuestionModalFooter
        supportResult={supportResult}
        question={question}
        isValidLength={isValidLength}
        buttonEnabled={buttonEnabled}
        handleQuestionImprovement={handleQuestionImprovement}
        handleCreateOrUpdate={handleCreateOrUpdate}
        handleRetry={handleRetry}
        accept={accept}
        reject={reject}
      />
    </div>
  );
}

export default CreateQuestionModal;
