import React, { Suspense } from 'react';

import { ReplyListSkeletonUI } from '@/widgets/reply-list';

const LazyQuestionReplyPage = React.lazy(() =>
  import('@/widgets/reply-list').then((module) => ({ default: module.ReplyList })),
);

function QuestionReplyPage() {
  return (
    <Suspense fallback={<ReplyListSkeletonUI />}>
      <LazyQuestionReplyPage />
    </Suspense>
  );
}

export default QuestionReplyPage;
