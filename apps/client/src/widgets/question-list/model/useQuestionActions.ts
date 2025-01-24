import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { throttle } from 'es-toolkit';
import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { patchQuestionClosed } from '@/features/close-question';
import { deleteQuestion } from '@/features/delete-question';
import { postQuestionLike } from '@/features/like-question';
import { patchQuestionPinned } from '@/features/pin-question';

import { Question, useSessionStore } from '@/entities/session';

import { useToastStore } from '@/shared/ui/toast';

export const useQuestionActions = (question: Question, onQuestionSelect: () => void) => {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);

  const { sessionToken, sessionId, isHost, expired, removeQuestion, updateQuestion, setFromDetail } = useSessionStore(
    useShallow((state) => ({
      sessionToken: state.sessionToken,
      sessionId: state.sessionId,
      isHost: state.isHost,
      expired: state.expired,
      removeQuestion: state.removeQuestion,
      updateQuestion: state.updateQuestion,
      setFromDetail: state.setFromDetail,
    })),
  );

  const handleSelectQuestionId = () => {
    if (!sessionId) return;
    setFromDetail(true);
    onQuestionSelect();
    navigate({ to: `/session/${sessionId}/${question.questionId}` });
  };

  const { mutate: likeQuestionQuery, isPending: isLikeInProgress } = useMutation({
    mutationFn: (params: { questionId: number; token: string; sessionId: string }) =>
      postQuestionLike(params.questionId, {
        token: params.token,
        sessionId: params.sessionId,
      }),
    onSuccess: (res) => {
      addToast({
        type: 'SUCCESS',
        message: question.liked ? '좋아요를 취소했습니다.' : '질문에 좋아요를 눌렀습니다.',
        duration: 3000,
      });
      updateQuestion({
        ...question,
        ...res,
      });
    },
    onError: console.error,
  });

  const handleLike = useCallback(
    throttle(
      () => {
        if (expired || !sessionToken || !sessionId || isLikeInProgress) return;

        likeQuestionQuery({
          questionId: question.questionId,
          token: sessionToken,
          sessionId,
        });
      },
      1000,
      { edges: ['leading'] },
    ),
    [],
  );

  const { mutate: closeQuestionQuery, isPending: isCloseInProgress } = useMutation({
    mutationFn: (params: { questionId: number; token: string; sessionId: string; closed: boolean }) =>
      patchQuestionClosed(params.questionId, {
        token: params.token,
        sessionId: params.sessionId,
        closed: params.closed,
      }),
    onSuccess: () => {
      addToast({
        type: 'SUCCESS',
        message: question.closed ? '질문 답변 완료를 취소했습니다.' : '질문을 답변 완료했습니다.',
        duration: 3000,
      });
      updateQuestion({
        ...question,
        closed: !question.closed,
      });
    },
    onError: console.error,
  });

  const handleClose = () => {
    if (expired || !sessionToken || !sessionId || !isHost || isCloseInProgress) return;

    closeQuestionQuery({
      questionId: question.questionId,
      token: sessionToken,
      sessionId,
      closed: !question.closed,
    });
  };

  const { mutate: pinQuestionQuery, isPending: isPinInProgress } = useMutation({
    mutationFn: (params: { questionId: number; token: string; sessionId: string; pinned: boolean }) =>
      patchQuestionPinned(params.questionId, {
        token: params.token,
        sessionId: params.sessionId,
        pinned: params.pinned,
      }),
    onSuccess: () => {
      addToast({
        type: 'SUCCESS',
        message: question.pinned ? '질문 고정을 취소했습니다.' : '질문을 고정했습니다.',
        duration: 3000,
      });
      updateQuestion({
        ...question,
        pinned: !question.pinned,
      });
    },
    onError: console.error,
  });

  const handlePin = () => {
    if (expired || !sessionToken || !sessionId || !isHost || isPinInProgress) return;

    pinQuestionQuery({
      questionId: question.questionId,
      token: sessionToken,
      sessionId,
      pinned: !question.pinned,
    });
  };

  const { mutate: deleteQuestionQuery, isPending: isDeleteInProgress } = useMutation({
    mutationFn: (params: { questionId: number; sessionId: string; token: string }) =>
      deleteQuestion(params.questionId, {
        sessionId: params.sessionId,
        token: params.token,
      }),
    onSuccess: () => {
      addToast({
        type: 'SUCCESS',
        message: '질문을 삭제했습니다.',
        duration: 3000,
      });
      removeQuestion(question.questionId);
    },
    onError: console.error,
  });

  const handleDelete = () => {
    if (expired || !sessionToken || !sessionId || isDeleteInProgress) return;

    deleteQuestionQuery({
      questionId: question.questionId,
      sessionId,
      token: sessionToken,
    });
  };

  return {
    isHost,
    expired,
    sessionId,
    handleLike,
    handleClose,
    handlePin,
    handleDelete,
    handleSelectQuestionId,
  };
};
