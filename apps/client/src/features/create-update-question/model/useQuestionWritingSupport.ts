import { useState } from 'react';

import { AIRequestType, postAIHistory } from '@/features/ai-history';
import {
  postRetryQuestionImprovement,
  RetryImproveQuestionRequest,
} from '@/features/create-update-question/api/improve-question-retry.api';
import {
  postQuestionImprovementStream,
  QuestionImprovementRequest,
} from '@/features/create-update-question/api/improve-question.api';

import { useToastStore } from '@/shared/ui/toast';

export const useQuestionWritingSupport = ({
  body,
  handleAccept,
}: {
  body: string;
  handleAccept: (body: string) => void;
}) => {
  const [supportResult, setSupportResult] = useState<string | null>(null);
  const [supportType, setSupportType] = useState<AIRequestType | null>(null);

  const [isPending, setIsPending] = useState(false);

  const addToast = useToastStore((state) => state.addToast);

  const questionImprovement = (body: QuestionImprovementRequest, onComplete: () => void) => {
    setIsPending(true);
    postQuestionImprovementStream(
      body,
      ({ content }) => {
        setSupportResult((prev) => (prev ?? '') + content);
      },
      () => {
        onComplete();
        setIsPending(false);
      },
      () => {
        onComplete();
        setIsPending(false);
        addToast({
          type: 'ERROR',
          message: '3초 뒤에 다시 시도해주세요.',
          duration: 3000,
        });
      },
    );
  };

  const retryQuestionImprovement = (body: RetryImproveQuestionRequest, onComplete: () => void) => {
    setSupportResult(null);
    setIsPending(true);
    postRetryQuestionImprovement(
      body,
      ({ content }) => {
        setSupportResult((prev) => (prev ?? '') + content);
      },
      () => {
        onComplete();
        setIsPending(false);
      },
      () => {
        onComplete();
        setIsPending(false);
        addToast({
          type: 'ERROR',
          message: '3초 뒤에 다시 시도해주세요.',
          duration: 3000,
        });
      },
    );
  };

  const accept = () => {
    if (supportResult && supportType) {
      handleAccept(supportResult);
      postAIHistory({
        promptName: supportType,
        request: body,
        response: supportResult,
        result: 'ACCEPT',
      });
      setSupportResult(null);
    }
  };

  const reject = () => {
    if (supportResult && supportType) {
      postAIHistory({
        promptName: supportType,
        request: body,
        response: supportResult,
        result: 'REJECT',
      });
      setSupportResult(null);
    }
  };

  return {
    questionImprovement,
    retryQuestionImprovement,
    supportResult,
    accept,
    reject,
    supportType,
    setSupportType,
    isPending,
  };
};
