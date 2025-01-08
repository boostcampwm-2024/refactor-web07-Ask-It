import { redirect } from '@tanstack/react-router';

import { refresh, useAuthStore } from '@/features/auth';
import { getSessionToken, useSessionStore } from '@/features/session';
import { getChattingList } from '@/features/session/chatting';
import { getQuestions } from '@/features/session/qna';

export interface LoadSessionOptions {
  sessionId: string;
  questionId?: string; // questionId가 필요한 경우만 사용
  skipRefresh?: boolean; // 이미 로그인/refresh 검증을 밖에서 했으면 생략
  fromDetailBehavior?: boolean; // fromDetail 관련 로직 처리 여부
}

/**
 * 세션 & QnA & 채팅 정보를 한 번에 로드해 주는 유틸.
 * 에러가 발생하면 내부에서 redirect를 throw할 수 있음.
 */
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
  if (!skipRefresh && !authStore.isLogin()) {
    try {
      const res = await refresh();
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
        throw redirect({ to: `/session/${sessionId}` });
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
