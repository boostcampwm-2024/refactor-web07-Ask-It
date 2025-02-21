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

import { useToastStore } from '@/shared/ui/toast';

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

  const addToast = useToastStore((state) => state.addToast);

  const replyImprovement = (body: ReplyImprovementRequest, onComplete: () => void) => {
    setIsPending(true);
    postReplyImprovementStream(
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

  const retryReplyImprovement = (body: RetryReplyImprovementRequest, onComplete: () => void) => {
    setSupportResult(null);
    setIsPending(true);
    postRetryReplyImprovement(
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
