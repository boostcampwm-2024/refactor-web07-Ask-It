import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { postQuestionImprovement } from '@/features/create-update-question/api/improve-question.api';
import { postQuestionShortening } from '@/features/create-update-question/api/shortening-question.api';

export const useQuestionWritingSupport = ({ handleAccept }: { handleAccept: (body: string) => void }) => {
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

  const [supportResult, setSupportResult] = useState<string | null>(null);

  const accept = () => {
    if (supportResult) {
      handleAccept(supportResult);
      setSupportResult(null);
    }
  };

  const reject = () => {
    setSupportResult(null);
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
  };
};
