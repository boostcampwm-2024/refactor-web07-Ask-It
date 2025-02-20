import Markdown from 'react-markdown';

import { Reply } from '@/entities/session';

interface ReplyBodyProps {
  reply: Pick<Reply, 'body' | 'deleted'>;
}

function ReplyBody({ reply }: Readonly<ReplyBodyProps>) {
  const replyContent = reply.deleted ? '삭제된 답변입니다' : reply.body;

  return (
    <Markdown className='prose prose-stone flex h-full w-full flex-col justify-start gap-3 text-base font-medium leading-normal text-black prose-img:rounded-md'>
      {replyContent}
    </Markdown>
  );
}

export default ReplyBody;
