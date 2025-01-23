import { useEffect } from 'react';
import React from 'react';

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

  return <LazyQuestionList />;
}

export default SessionPage;
