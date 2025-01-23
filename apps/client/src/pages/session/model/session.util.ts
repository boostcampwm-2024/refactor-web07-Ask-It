import { redirect } from '@tanstack/react-router';

import { tokenRefresh, useAuthStore } from '@/features/auth';
import { getChattingList } from '@/features/get-chatting-list';
import { getQuestions } from '@/features/get-questions';
import { getSessionToken } from '@/features/get-session-token';

import { useSessionStore } from '@/entities/session';

export interface LoadSessionOptions {
  sessionId: string;
  questionId?: string; // questionId가 필요한 경우만 사용
  skipRefresh?: boolean; // 이미 로그인/refresh 검증을 밖에서 했으면 생략
  fromDetailBehavior?: boolean;
}

export async function loadSessionData(options: LoadSessionOptions) {
  const { sessionId, questionId, skipRefresh = false, fromDetailBehavior = false } = options;

  const sessionStore = useSessionStore.getState();
  const authStore = useAuthStore.getState();
  const {
    reset,
    setSessionId,
    setSessionToken,
    setIsHost,
    setExpired,
    setSessionTitle,
    addQuestion,
    addChatting,
    setSelectedQuestionId,
    setFromDetail,
  } = sessionStore;

  // 1) [옵션] 로그인/refresh
  if (!skipRefresh && !authStore.accessToken) {
    try {
      const res = await tokenRefresh();
      authStore.setAuthInformation(res);
    } catch (error) {
      console.error(error);
      // refresh 실패 시 어떻게 처리할지
      // throw redirect({ to: '/' });
      // or just re-throw
    }
  }

  // 2) reset store
  reset();

  // 3) 세션 토큰 불러오기
  let token: string;
  try {
    const tokenRes = await getSessionToken(sessionId);
    token = tokenRes.token;

    setSessionId(sessionId);
    setSessionToken(token);
  } catch (e) {
    console.error(e);
    throw redirect({ to: '/' });
  }

  // 4) 질문(QnA) 로드
  try {
    const response = await getQuestions({ sessionId, token });

    setIsHost(response.isHost);
    setExpired(response.expired);
    setSessionTitle(response.sessionTitle);

    response.questions.forEach(addQuestion);

    // questionId가 있으면 선택 상태를 세팅하거나, 없는 경우 페이지 리다이렉트 등 처리
    if (questionId) {
      setSelectedQuestionId(Number(questionId));

      // 질문 목록에 questionId가 없으면 리다이렉트
      const found = response.questions.some((q) => q.questionId === Number(questionId));
      if (!found) {
        throw redirect({ to: `/session/$sessionId`, params: { sessionId } });
      }

      // fromDetailBehavior 옵션이 true면, 세부 로직 추가
      if (fromDetailBehavior) {
        setFromDetail(true);
      }
    }
  } catch (e) {
    console.error(e);
    // TanStack router에서 isRedirect로 검사 후 재-throw
    throw redirect({ to: '/' });
  }

  // 5) 채팅 로드
  try {
    const { chats } = await getChattingList(token, sessionId);
    chats.reverse().forEach(addChatting);
  } catch (e) {
    console.error(e);
    throw redirect({ to: '/' });
  }
}
