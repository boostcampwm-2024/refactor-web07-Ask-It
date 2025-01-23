import { GrValidate } from 'react-icons/gr';

import { Reply } from '@/entities/session';

function ReplyHeader({ reply }: { reply: Pick<Reply, 'deleted' | 'isHost' | 'nickname'> }) {
  const nickname = reply.deleted ? '알 수 없음' : reply.nickname;
  const showHostBadge = !reply.deleted && reply.isHost;

  return (
    <div className='flex flex-row items-center gap-1 text-indigo-600'>
      {showHostBadge && <GrValidate size={18} />}
      <span className='w-full text-base font-bold leading-normal text-black'>{nickname}</span>
    </div>
  );
}

export default ReplyHeader;
