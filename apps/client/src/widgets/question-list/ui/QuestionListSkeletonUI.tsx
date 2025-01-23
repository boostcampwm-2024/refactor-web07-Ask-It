import { useEffect, useState } from 'react';

function QuestionListSkeletonUI() {
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
            <div className='h-6 w-32 animate-pulse rounded bg-indigo-100'></div>
            <div className='flex gap-2'>
              <div className='h-8 w-16 animate-pulse rounded bg-indigo-100'></div>
              <div className='h-8 w-20 animate-pulse rounded bg-indigo-100'></div>
            </div>
          </div>
          <div className='flex w-full flex-col gap-4 p-8'>
            <div className='space-y-4'>
              <hr className='h-1 w-full animate-pulse rounded bg-indigo-100' />
              <div className='h-20 w-full animate-pulse rounded bg-indigo-50'></div>
              <div className='h-20 w-full animate-pulse rounded bg-indigo-50'></div>
            </div>
            <div className='space-y-4'>
              <hr className='h-1 w-full animate-pulse rounded bg-indigo-100' />
              <div className='h-20 w-full animate-pulse rounded bg-indigo-50'></div>
              <div className='h-20 w-full animate-pulse rounded bg-indigo-50'></div>
              <div className='h-20 w-full animate-pulse rounded bg-indigo-50'></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default QuestionListSkeletonUI;
