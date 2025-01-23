import { useEffect, useState } from 'react';

function ChattingListSkeletonUI() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='inline-flex h-full w-1/5 min-w-[240px] flex-col items-center justify-start rounded-lg bg-slate-50 shadow'>
      {shouldRender && (
        <>
          <div className='inline-flex h-[54px] w-full items-center justify-between border-b border-gray-200 px-4 py-3'>
            <div className='h-7 w-24 animate-pulse rounded bg-indigo-100'></div>
            <div className='h-6 w-20 animate-pulse rounded bg-green-100'></div>
          </div>

          <div className='inline-flex h-full w-full flex-col items-start justify-start gap-3 overflow-y-auto p-2.5'>
            <div className='flex w-full flex-col gap-3'>
              {[...Array(6)].map((_, i) => (
                <div key={i} className='flex w-3/4 flex-col gap-1'>
                  <div className='h-4 w-16 animate-pulse rounded bg-indigo-100'></div>
                  <div className='h-12 animate-pulse rounded-lg bg-indigo-50 p-2'></div>
                </div>
              ))}
            </div>
          </div>

          <div className='inline-flex h-[75px] w-full items-center justify-center gap-2.5 border-t border-gray-200 bg-gray-50 p-4'>
            <div className='h-12 w-full animate-pulse rounded-md bg-white'></div>
          </div>
        </>
      )}
    </div>
  );
}

export default ChattingListSkeletonUI;
