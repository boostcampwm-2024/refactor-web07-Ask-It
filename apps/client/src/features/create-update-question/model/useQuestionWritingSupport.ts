import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { AIRequestType, postAIHistory } from '@/features/ai-history';
import { postQuestionImprovement } from '@/features/create-update-question/api/improve-question.api';
import { postQuestionShortening } from '@/features/create-update-question/api/shortening-question.api';

export const useQuestionWritingSupport = ({
  body,
  handleAccept,
}: {
  body: string;
  handleAccept: (body: string) => void;
}) => {
  const [supportResult, setSupportResult] = useState<string | null>(null);
  const [supportType, setSupportType] = useState<AIRequestType | null>(null);

  const { mutate: questionImprovement, isPending: isQuestionImprovementInProgress } = useMutation({
    mutationFn: postQuestionImprovement,
    onSuccess: (data) => {
      setSupportResult(data.result.question);
    },
  });

  const { mutate: questionShortening, isPending: isQuestionShorteningInProgress } = useMutation({
    mutationFn: postQuestionShortening,
    onSuccess: (data) => {
      setSupportResult(data.result.question);
    },
  });

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

  const requestEnable = !isQuestionImprovementInProgress && !isQuestionShorteningInProgress;

  return {
    questionImprovement,
    questionShortening,
    isQuestionImprovementInProgress,
    requestEnable,
    supportResult,
    accept,
    reject,
    supportType,
    setSupportType,
  };
};
