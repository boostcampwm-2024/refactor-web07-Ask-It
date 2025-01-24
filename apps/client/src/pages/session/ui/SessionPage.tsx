import React, { Suspense, useEffect } from 'react';

import { QuestionListSkeletonUI } from '@/widgets/question-list';

import { useSessionStore } from '@/entities/session';

const LazyQuestionList = React.lazy(() =>
  import('@/widgets/question-list').then((module) => ({ default: module.QuestionList })),
);

function SessionPage() {
  const sessionTitle = useSessionStore((state) => state.sessionTitle);

  useEffect(() => {
    if (sessionTitle) {
      document.title = `Ask-It - ${sessionTitle}`;
    }
  }, [sessionTitle]);

  return (
    <Suspense fallback={<QuestionListSkeletonUI />}>
      <LazyQuestionList />
    </Suspense>
  );
}

export default SessionPage;
