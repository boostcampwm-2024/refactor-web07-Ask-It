import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import {
  postQuestionImprovement,
  QuestionImprovementRequest,
} from '@/features/create-update-question/api/improve-question.api';

export const useQuestionWritingSupport = ({ handleAccept }: { handleAccept: (body: string) => void }) => {
  const { mutate: questionImprovement, isPending: isQuestionImprovementInProgress } = useMutation({
    mutationFn: (request: QuestionImprovementRequest) => {
      return postQuestionImprovement(request);
    },
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

  const requestEnable = !isQuestionImprovementInProgress;

  return {
    questionImprovement,
    isQuestionImprovementInProgress,
    requestEnable,
    supportResult,
    accept,
    reject,
  };
};
