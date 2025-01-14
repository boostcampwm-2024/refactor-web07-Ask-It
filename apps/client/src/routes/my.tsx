import { createFileRoute, redirect } from '@tanstack/react-router';
import React from 'react';

import { refresh, useAuthStore } from '@/features/auth';

const LazyMyPage = React.lazy(() => import('@/pages').then((module) => ({ default: module.MyPage })));

export const Route = createFileRoute('/my')({
  component: () => (
    <React.Suspense>
      <LazyMyPage />
    </React.Suspense>
  ),
  beforeLoad: () => {
    const { isLogin, setAuthInformation } = useAuthStore.getState();

    if (!isLogin()) {
      return refresh()
        .then((res) => {
          setAuthInformation(res);
        })
        .catch((error) => {
          console.error(error);
          throw redirect({ to: '/' });
        });
    }
    return Promise.resolve();
  },
});
