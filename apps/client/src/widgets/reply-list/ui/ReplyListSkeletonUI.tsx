import { useEffect, useState } from 'react';

function ReplyListSkeletonUI() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='inline-flex h-full w-4/5 flex-grow animate-pulse flex-col items-center justify-start rounded-lg bg-slate-50 shadow'>
      {shouldRender && (
        <>
          <div className='inline-flex h-[54px] w-full items-center justify-between border-b border-gray-200 px-8 py-2'>
            <div className='flex flex-row items-center gap-2'>
              <div className='h-6 w-6 animate-pulse rounded bg-indigo-100'></div>
              <div className='h-6 w-24 animate-pulse rounded bg-indigo-100'></div>
            </div>
            <div className='h-8 w-20 animate-pulse rounded bg-indigo-100'></div>
          </div>
          <div className='inline-flex h-full w-full flex-col items-start justify-start gap-4 overflow-y-auto pb-4'>
            <div className='flex h-fit flex-col items-start justify-center gap-2.5 self-stretch border-b border-gray-200/50 px-12 py-4'>
              <div className='h-24 w-full animate-pulse rounded bg-indigo-50'></div>
            </div>
            <div className='flex w-full flex-col gap-4 px-12'>
              <div className='h-32 w-full animate-pulse rounded-lg bg-indigo-50 p-4'></div>
              <div className='h-32 w-full animate-pulse rounded-lg bg-indigo-50 p-4'></div>
              <div className='h-32 w-full animate-pulse rounded-lg bg-indigo-50 p-4'></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReplyListSkeletonUI;
