import { Link } from '@tanstack/react-router';

import { Session } from '@/entities/session';

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}. ${month}. ${day}`;
};

interface SessionRecordProps {
  session: Session;
}

function SessionRecord({ session }: Readonly<SessionRecordProps>) {
  return (
    <div className='flex h-fit flex-col items-start justify-start gap-4 self-stretch border-b border-gray-200 px-2.5 pb-4 pt-2.5'>
      <div className='flex h-fit flex-col items-start justify-center gap-2.5 self-stretch'>
        {session.expired ? (
          <div className='inline-flex items-center justify-center gap-2.5 rounded bg-red-100 px-2 py-1'>
            <div className='text-base font-medium text-red-600'>만료된 세션</div>
          </div>
        ) : (
          <div className='inline-flex items-center justify-center gap-2.5 rounded bg-green-100 px-2 py-1'>
            <div className='text-base font-medium text-green-800'>진행 중인 세션</div>
          </div>
        )}
      </div>
      <div className='inline-flex items-start justify-between self-stretch px-1'>
        <Link to='/session/$sessionId' params={{ sessionId: session.sessionId }}>
          <div className='text-base font-medium leading-normal text-black'>{session.title}</div>
        </Link>
        <div className='flex items-center justify-center gap-2.5 rounded px-2 py-1'>
          <div className='text-base font-medium text-gray-500'>{formatDate(new Date(session.createdAt))}</div>
        </div>
      </div>
    </div>
  );
}

export default SessionRecord;
