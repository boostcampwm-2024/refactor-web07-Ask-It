import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

import { refresh, useAuthStore } from '@/features/auth';

const LazyHomePage = React.lazy(() => import('@/pages/home').then((module) => ({ default: module.HomePage })));

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { accessToken, setAuthInformation } = useAuthStore.getState();

    if (!accessToken)
      refresh()
        .then((res) => {
          setAuthInformation(res);
        })
        .catch(console.error);
  },
  component: () => (
    <React.Suspense>
      <LazyHomePage />
    </React.Suspense>
  ),
});
