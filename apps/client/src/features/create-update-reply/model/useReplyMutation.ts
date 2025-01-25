import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { postReply } from '@/features/create-update-reply/api/create-reply.api';
import { patchReplyBody } from '@/features/create-update-reply/api/update-reply.api';

import { Question, Reply, useSessionStore } from '@/entities/session';

import { useModalContext } from '@/shared/ui/modal';
import { useToastStore } from '@/shared/ui/toast';

export const useReplyMutation = (question?: Question, reply?: Reply) => {
  const { closeModal } = useModalContext();
  const addToast = useToastStore((state) => state.addToast);

  const { sessionToken, sessionId, expired, addReply, updateReply } = useSessionStore(
    useShallow((state) => ({
      sessionToken: state.sessionToken,
      sessionId: state.sessionId,
      expired: state.expired,
      addReply: state.addReply,
      updateReply: state.updateReply,
    })),
  );

  const [body, setBody] = useState('');

  const { mutate: postReplyQuery, isPending: isPostInProgress } = useMutation({
    mutationFn: postReply,
    onSuccess: (res) => {
      if (!reply && question) {
        addReply(question.questionId, {
          ...res.reply,
          userId: null,
          deleted: false,
        });
        addToast({
          type: 'SUCCESS',
          message: '답변이 성공적으로 등록되었습니다.',
          duration: 3000,
        });
        closeModal();
      }
    },
    onError: console.error,
  });

  const { mutate: patchReplyBodyQuery, isPending: isPatchInProgress } = useMutation({
    mutationFn: (params: { replyId: number; token: string; sessionId: string; body: string }) =>
      patchReplyBody(params.replyId, {
        token: params.token,
        sessionId: params.sessionId,
        body: params.body,
      }),
    onSuccess: (res) => {
      if (reply && question) {
        updateReply(question.questionId, res.reply);
        addToast({
          type: 'SUCCESS',
          message: '답변이 성공적으로 수정되었습니다.',
          duration: 3000,
        });
        closeModal();
      }
    },
    onError: console.error,
  });

  const submitDisabled =
    expired || body.trim().length === 0 || !sessionId || !sessionToken || isPostInProgress || isPatchInProgress;

  const handleSubmit = () => {
    if (submitDisabled) return;

    if (!reply && question) {
      postReplyQuery({
        sessionId,
        token: sessionToken,
        questionId: question?.questionId,
        body,
      });
    } else if (reply && question) {
      patchReplyBodyQuery({
        replyId: reply.replyId,
        token: sessionToken,
        sessionId,
        body,
      });
    }
  };

  useEffect(() => {
    if (reply) setBody(reply.body);
  }, [reply]);

  return { body, setBody, handleSubmit, submitDisabled };
};
