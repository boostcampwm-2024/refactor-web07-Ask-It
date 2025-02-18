import { Chat } from '@/entities/session/model/chatting.type';

interface ChattingMessageProps {
  showAbuseMessage: boolean;
  chat: Chat;
}

function ChattingMessage({ showAbuseMessage, chat: { nickname, content, abuse } }: Readonly<ChattingMessageProps>) {
  return (
    <div className='inline-flex flex-col items-start justify-start gap-1 self-stretch p-2.5'>
      <span className='flex-shrink-0 text-sm font-semibold text-indigo-600'>{nickname}</span>
      <span className='shrink grow basis-0 break-all text-sm font-medium text-black'>
        {abuse && showAbuseMessage ? '클린봇이 부적절한 표현을 감지한 댓글입니다.' : content}
      </span>
    </div>
  );
}

export default ChattingMessage;
