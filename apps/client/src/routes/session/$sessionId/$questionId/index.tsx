import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router';

import { loadSessionData, useSessionStore } from '@/features/session';

import { QuestionDetail } from '@/components';

export const Route = createFileRoute('/session/$sessionId/$questionId/')({
  component: QuestionDetail,
  beforeLoad: async ({ params: { sessionId, questionId } }) => {
    const { fromDetail } = useSessionStore.getState();

    if (fromDetail) {
      return; // 그대로 빠져나감
    }

    try {
      await loadSessionData({
        sessionId,
        questionId,
        fromDetailBehavior: true,
      });
    } catch (e) {
      console.error(e);
      if (isRedirect(e)) throw e;
      throw redirect({ to: '/' });
    }
  },
});
