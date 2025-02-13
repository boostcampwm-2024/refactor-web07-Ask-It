import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { AIRequestType, postAIHistory } from '@/features/ai-history';
import { postRetryReplyImprovement } from '@/features/create-update-reply/api/improve-reply-retry.api';
import { postReplyImprovement } from '@/features/create-update-reply/api/improve-reply.api';

export const useReplyWritingSupport = ({
  questionBody,
  body,
  handleAccept,
}: {
  questionBody: string;
  body: string;
  handleAccept: (body: string) => void;
}) => {
  const [supportResult, setSupportResult] = useState<string | null>(null);
  const [supportType, setSupportType] = useState<AIRequestType | null>(null);

  const { mutate: replyImprovement, isPending: isReplyImprovementInProgress } = useMutation({
    mutationFn: postReplyImprovement,
    onSuccess: (data) => {
      setSupportResult(data.result.reply);
    },
  });

  const { mutate: retryReplyImprovement, isPending: isRetryReplyImprovementInProgress } = useMutation({
    mutationFn: postRetryReplyImprovement,
    onSuccess: (data) => {
      setSupportResult(data.result.reply);
    },
  });

  const request = `# Q)\n${questionBody}\n\n# A)\n${body}`;

  const accept = () => {
    if (supportResult && supportType) {
      handleAccept(supportResult);
      postAIHistory({
        promptName: supportType,
        request,
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
        request,
        response: supportResult,
        result: 'REJECT',
      });
      setSupportResult(null);
    }
  };

  const requestEnable = !isReplyImprovementInProgress && !isRetryReplyImprovementInProgress;

  return {
    replyImprovement,
    retryReplyImprovement,
    supportResult,
    setSupportResult,
    supportType,
    setSupportType,
    accept,
    reject,
    requestEnable,
  };
};
