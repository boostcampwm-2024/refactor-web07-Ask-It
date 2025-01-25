import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { postQuestion } from '@/features/create-update-question/api/create-question.api';
import { patchQuestionBody } from '@/features/create-update-question/api/update-question.api';

import { Question, useSessionStore } from '@/entities/session';

import { useModalContext } from '@/shared/ui/modal';
import { useToastStore } from '@/shared/ui/toast';

export const useQuestionMutation = (question?: Question) => {
  const { closeModal } = useModalContext();
  const addToast = useToastStore((state) => state.addToast);

  const { sessionId, sessionToken, expired, addQuestion, updateQuestion } = useSessionStore(
    useShallow((state) => ({
      sessionId: state.sessionId,
      sessionToken: state.sessionToken,
      expired: state.expired,
      addQuestion: state.addQuestion,
      updateQuestion: state.updateQuestion,
    })),
  );

  const [body, setBody] = useState('');

  const { mutate: postQuestionQuery, isPending: isPostInProgress } = useMutation({
    mutationFn: postQuestion,
    onSuccess: (response) => {
      addQuestion(response.question);
      addToast({
        type: 'SUCCESS',
        message: '질문이 성공적으로 등록되었습니다.',
        duration: 3000,
      });
      closeModal();
    },
    onError: console.error,
  });

  const { mutate: patchQuestionBodyQuery, isPending: isPatchInProgress } = useMutation({
    mutationFn: (params: { questionId: number; token: string; sessionId: string; body: string }) =>
      patchQuestionBody(params.questionId, {
        token: params.token,
        sessionId: params.sessionId,
        body: params.body,
      }),
    onSuccess: (response) => {
      updateQuestion(response.question);
      addToast({
        type: 'SUCCESS',
        message: '질문이 성공적으로 수정되었습니다.',
        duration: 3000,
      });
      closeModal();
    },
    onError: console.error,
  });

  const submitDisabled =
    expired || body.trim().length === 0 || !sessionId || !sessionToken || isPostInProgress || isPatchInProgress;

  const handleSubmit = () => {
    if (submitDisabled) return;

    if (!question) {
      postQuestionQuery({
        token: sessionToken,
        sessionId,
        body,
      });
    } else {
      patchQuestionBodyQuery({
        questionId: question.questionId,
        token: sessionToken,
        sessionId,
        body,
      });
    }
  };

  useEffect(() => {
    if (question) setBody(question.body);
  }, [question]);

  return { body, setBody, handleSubmit, submitDisabled };
};
