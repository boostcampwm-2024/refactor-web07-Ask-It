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

  const questionImprovement = (body: QuestionImprovementRequest) => {
    setIsPending(true);
    postQuestionImprovementStream(
      body,
      ({ content }) => {
        setSupportResult((prev) => (prev ?? '') + content);
      },
      () => {
        setIsPending(false);
      },
    );
  };

  const retryQuestionImprovement = (body: RetryImproveQuestionRequest) => {
    setSupportResult(null);
    setIsPending(true);
    postRetryQuestionImprovement(
      body,
      ({ content }) => {
        setSupportResult((prev) => (prev ?? '') + content);
      },
      () => {
        setIsPending(false);
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
