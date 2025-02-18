import { useState } from 'react';

import { AIRequestType, postAIHistory } from '@/features/ai-history';
import {
  postRetryReplyImprovement,
  RetryReplyImprovementRequest,
} from '@/features/create-update-reply/api/improve-reply-retry.api';
import {
  postReplyImprovementStream,
  ReplyImprovementRequest,
} from '@/features/create-update-reply/api/improve-reply.api';

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

  const [isPending, setIsPending] = useState(false);

  const replyImprovement = (body: ReplyImprovementRequest) => {
    setIsPending(true);
    postReplyImprovementStream(
      body,
      ({ content }) => {
        setSupportResult((prev) => (prev ?? '') + content);
      },
      () => {
        setIsPending(false);
      },
    );
  };

  const retryReplyImprovement = (body: RetryReplyImprovementRequest) => {
    setSupportResult(null);
    setIsPending(true);
    postRetryReplyImprovement(
      body,
      ({ content }) => {
        setSupportResult((prev) => (prev ?? '') + content);
      },
      () => {
        setIsPending(false);
      },
    );
  };

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

  return {
    replyImprovement,
    retryReplyImprovement,
    supportResult,
    setSupportResult,
    supportType,
    setSupportType,
    accept,
    reject,
    isPending,
  };
};
