import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';

import { loadSessionData, useSessionStore } from '@/features/session';

import { QuestionList } from '@/components';

function SessionComponent() {
  const { sessionTitle } = useSessionStore();

  useEffect(() => {
    if (sessionTitle) {
      document.title = `Ask-It - ${sessionTitle}`;
    }
  }, [sessionTitle]);

  return <QuestionList />;
}

export const Route = createFileRoute('/session/$sessionId/')({
  component: SessionComponent,
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
