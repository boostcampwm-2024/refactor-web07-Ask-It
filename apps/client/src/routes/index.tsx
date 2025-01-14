import { createFileRoute } from '@tanstack/react-router';
import React from 'react';

import { refresh, useAuthStore } from '@/features/auth';

const LazyHomePage = React.lazy(() => import('@/pages').then((module) => ({ default: module.HomePage })));

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { isLogin, setAuthInformation } = useAuthStore.getState();

    if (!isLogin())
      refresh()
        .then((res) => {
          setAuthInformation(res);
        })
        .catch(console.error);
  },
  component: LazyHomePage,
});
