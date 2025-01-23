import { createFileRoute, redirect } from '@tanstack/react-router';

import { loadSessionData, SessionPage } from '@/pages/session';

import { useSessionStore } from '@/entities/session';

export const Route = createFileRoute('/session/$sessionId/')({
  component: SessionPage,
  beforeLoad: async ({ params: { sessionId } }) => {
    const { fromDetail, setFromDetail } = useSessionStore.getState();

    // fromDetail이면 빠져나가기
    if (fromDetail) {
      setFromDetail(false);
      return;
    }

    try {
      await loadSessionData({
        sessionId,
        // questionId 없음
      });
    } catch (e) {
      console.error(e);
      // isRedirect가 아닌 경우 추가 처리
      throw redirect({ to: '/' });
    }
  },
});
