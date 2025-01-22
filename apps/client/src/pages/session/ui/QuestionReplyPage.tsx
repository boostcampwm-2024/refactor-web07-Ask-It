import React from 'react';

const LazyQuestionReplyPage = React.lazy(() =>
  import('@/widgets/reply-list').then((module) => ({ default: module.ReplyList })),
);

function QuestionReplyPage() {
  return (
    <React.Suspense fallback={null}>
      <LazyQuestionReplyPage />
    </React.Suspense>
  );
}

export default QuestionReplyPage;
