import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { AIRequestType, postAIHistory } from '@/features/ai-history';
import { postQuestionImprovement } from '@/features/create-update-question/api/improve-question.api';

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

  const requestEnable = !isQuestionImprovementInProgress;

  return {
    questionImprovement,
    isQuestionImprovementInProgress,
    requestEnable,
    supportResult,
    accept,
    reject,
    supportType,
    setSupportType,
  };
};
