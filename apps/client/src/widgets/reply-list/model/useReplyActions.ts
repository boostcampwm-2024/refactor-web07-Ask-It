import { useMutation } from '@tanstack/react-query';
import { throttle } from 'es-toolkit';
import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { deleteReply } from '@/features/delete-reply';
import { postReplyLike } from '@/features/like-reply';

import { Question, Reply, useSessionStore } from '@/entities/session';

import { useToastStore } from '@/shared/ui/toast';

export const useReplyActions = (question: Question, reply: Reply) => {
  const addToast = useToastStore((state) => state.addToast);

  const { sessionId, sessionToken, isHost, expired, updateReply } = useSessionStore(
    useShallow((state) => ({
      sessionId: state.sessionId,
      sessionToken: state.sessionToken,
      isHost: state.isHost,
      expired: state.expired,
      updateReply: state.updateReply,
    })),
  );

  const { mutate: postReplyLikeQuery, isPending: isLikeInProgress } = useMutation({
    mutationFn: (params: { replyId: number; sessionId: string; token: string }) =>
      postReplyLike(params.replyId, {
        sessionId: params.sessionId,
        token: params.token,
      }),
    onSuccess: (res) => {
      addToast({
        type: 'SUCCESS',
        message: reply.liked ? '좋아요를 취소했습니다.' : '답변에 좋아요를 눌렀습니다.',
        duration: 3000,
      });
      updateReply(question.questionId, {
        ...reply,
        ...res,
      });
    },
    onError: console.error,
  });

  const handleLike = useCallback(
    throttle(
      () => {
        if (expired || !sessionId || !sessionToken || isLikeInProgress || reply.deleted) return;
        postReplyLikeQuery({
          replyId: reply.replyId,
          sessionId,
          token: sessionToken,
        });
      },
      1000,
      { edges: ['leading'] },
    ),
    [],
  );

  const { mutate: deleteReplyQuery, isPending: isDeleteInProgress } = useMutation({
    mutationFn: (params: { replyId: number; sessionId: string; token: string }) =>
      deleteReply(params.replyId, {
        sessionId: params.sessionId,
        token: params.token,
      }),
    onSuccess: () => {
      addToast({
        type: 'SUCCESS',
        message: '답변이 성공적으로 삭제되었습니다.',
        duration: 3000,
      });
      updateReply(question.questionId, {
        ...reply,
        deleted: true,
      });
    },
    onError: console.error,
  });

  const handleDelete = () => {
    if (expired || !sessionId || !sessionToken || isDeleteInProgress) return;
    deleteReplyQuery({
      replyId: reply.replyId,
      sessionId,
      token: sessionToken,
    });
  };

  return {
    isHost,
    expired,
    handleLike,
    handleDelete,
  };
};
