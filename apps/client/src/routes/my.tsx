import { createFileRoute, redirect } from '@tanstack/react-router';
import React from 'react';

import { tokenRefresh, useAuthStore } from '@/features/auth';

const LazyMyPage = React.lazy(() => import('@/pages/my').then((module) => ({ default: module.MyPage })));

export const Route = createFileRoute('/my')({
  component: () => (
    <React.Suspense>
      <LazyMyPage />
    </React.Suspense>
  ),
  beforeLoad: () => {
    const { accessToken, setAuthInformation } = useAuthStore.getState();

    if (!accessToken) {
      return tokenRefresh()
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
