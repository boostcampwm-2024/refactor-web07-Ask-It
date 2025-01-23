import { createFileRoute, Outlet, redirect, ScrollRestoration } from '@tanstack/react-router';
import React, { Suspense } from 'react';

import { ChattingListSkeletonUI } from '@/widgets/chatting-list';

import { SocketProvider } from '@/features/socket';

const LazyChattingList = React.lazy(() =>
  import('@/widgets/chatting-list').then((module) => ({ default: module.ChattingList })),
);

export const Route = createFileRoute('/session')({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/session') throw redirect({ to: '/' });
  },
  component: () => (
    <div className='flex h-full w-full items-center justify-center gap-4 px-4 py-4 md:max-w-[1194px]'>
      <SocketProvider>
        <ScrollRestoration />
        <Outlet />
        <Suspense fallback={<ChattingListSkeletonUI />}>
          <LazyChattingList />
        </Suspense>
      </SocketProvider>
    </div>
  ),
});
