import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RiRobot2Line } from 'react-icons/ri';
import { useShallow } from 'zustand/react/shallow';

import { getChattingList } from '@/features/get-chatting-list';
import { useSocket } from '@/features/socket';

import { ChattingMessage, useSessionStore } from '@/entities/session';

import { useToastStore } from '@/shared/ui/toast';

function ChattingList() {
  const { expired, chatting, participantCount, sessionId, sessionToken, addChattingToFront } = useSessionStore(
    useShallow((state) => ({
      expired: state.expired,
      chatting: state.chatting,
      participantCount: state.participantCount,
      sessionId: state.sessionId,
      sessionToken: state.sessionToken,
      addChattingToFront: state.addChattingToFront,
    })),
  );

  const addToast = useToastStore((state) => state.addToast);

  const [message, setMessage] = useState('');
  const [isBottom, setIsBottom] = useState(true);
  const userScrolling = useRef(false);
  const autoScrolling = useRef(false);

  const socket = useSocket();

  const hasMoreRef = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevHeightRef = useRef(0);

  const [isLoading, setIsLoading] = useState(false);

  const [showAbuseMessage, setShowAbuseMessage] = useState(false);

  const checkScrollPosition = useCallback(() => {
    if (messagesEndRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = messagesEndRef.current;
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
      setIsBottom(isAtBottom);

      if (isAtBottom) userScrolling.current = false;
    }
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      userScrolling.current = false;
      autoScrolling.current = true;
      setIsBottom(true);
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: 'instant',
      });
      autoScrolling.current = false;
    }
  };

  const adjustScrollPosition = () => {
    const container = messagesEndRef.current;
    if (!container) return;

    const newHeight = container.scrollHeight;
    const heightDiff = newHeight - prevHeightRef.current;
    container.scrollTop = heightDiff;
  };

  const toggleShowAbuseMessage = () => {
    addToast({
      type: 'INFO',
      message: showAbuseMessage ? '클린봇 기능을 비활성화합니다.' : '클린봇 기능을 활성화합니다.',
      duration: 3000,
    });
    setShowAbuseMessage((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      const container = messagesEndRef.current;
      if (!container) return;

      if (container.scrollTop === 0) {
        if (!sessionId || !sessionToken || !chatting[0]?.chattingId || !hasMoreRef.current || isLoading) return;

        prevHeightRef.current = container.scrollHeight;

        setIsLoading(true);
        getChattingList(sessionToken, sessionId, chatting[0]?.chattingId)
          .then(({ chats }) => {
            if (chats.length < 20) hasMoreRef.current = false;
            chats.forEach(addChattingToFront);
            requestAnimationFrame(adjustScrollPosition);
          })
          .catch(console.error)
          .finally(() => {
            setIsLoading(false);
          });
      }

      userScrolling.current = true;
      checkScrollPosition();
    };

    const messageContainer = messagesEndRef.current;
    messageContainer?.addEventListener('scroll', handleScroll);

    return () => {
      messageContainer?.removeEventListener('scroll', handleScroll);
    };
  }, [checkScrollPosition, chatting, isLoading]);

  useEffect(() => {
    if (isBottom && !userScrolling.current) {
      scrollToBottom();
    }
  }, [chatting, isBottom]);

  return (
    <div className='inline-flex h-full w-1/5 min-w-[240px] flex-col items-center justify-start rounded-lg bg-white shadow'>
      <div className='inline-flex h-[54px] w-full items-center justify-between border-b border-gray-200 px-4 py-3'>
        <div className='shrink grow basis-0 text-lg font-medium text-black'>실시간 채팅</div>
        {!expired && (
          <div className='max-w-[100px] overflow-x-auto whitespace-nowrap bg-green-100 px-2 py-1 scrollbar-hide'>
            <p className='text-[10px] font-medium text-green-800'>{participantCount}명 참여중</p>
          </div>
        )}
      </div>

      <button
        className='fixed z-10 flex h-10 w-10 -translate-x-4 translate-y-14 items-center justify-center self-end rounded-full border bg-white p-2 shadow-md'
        onClick={toggleShowAbuseMessage}
      >
        <RiRobot2Line size={32} />
        {!showAbuseMessage && (
          <span className='pointer-events-none absolute left-[-5%] top-1/2 h-px w-[110%] rotate-45 transform bg-[rgba(0,0,0,0.2)]' />
        )}
      </button>

      <div
        className='relative inline-flex h-full w-full flex-col items-start justify-start overflow-y-auto overflow-x-hidden break-words p-2.5'
        ref={messagesEndRef}
      >
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className='flex w-full justify-center py-2'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.1 }}
            >
              <div className='h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500' />
            </motion.div>
          )}
        </AnimatePresence>
        {chatting.map((chat) => (
          <ChattingMessage showAbuseMessage={showAbuseMessage} key={chat.chattingId} chat={chat} />
        ))}
      </div>

      <div className='relative inline-flex h-[75px] w-full items-center justify-center gap-2.5 border-t border-gray-200 bg-gray-50 p-4'>
        {!isBottom && userScrolling.current && (
          <button
            type='button'
            onClick={scrollToBottom}
            className='absolute bottom-[110%] rounded-full bg-indigo-500 p-2 text-white shadow-lg transition-all hover:bg-indigo-600'
            aria-label='맨 아래로 스크롤'
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        )}
        <div className='flex w-full items-center justify-center self-stretch rounded-md border border-gray-200 bg-white p-3'>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing && message.trim().length) {
                socket?.sendChatMessage(message);
                setMessage('');
              }
            }}
            className='w-full text-sm font-medium text-gray-500 focus:outline-none'
            placeholder='채팅 메시지를 입력해주세요'
          />
        </div>
      </div>
    </div>
  );
}

export default ChattingList;
