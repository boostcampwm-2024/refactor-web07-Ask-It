import Markdown from 'react-markdown';

import { ContentType } from '@/features/create-update-reply/model/reply-modal.type';

import { Question, Reply } from '@/entities/session';

interface ReplyContentViewProps {
  supportResult: string | null;
  contentType: ContentType;
  questionBody: Question['body'];
  replyBody: Reply['body'];
  isWritingPending: boolean;
  onReplyBodyChange: (body: string) => void;
}

export default function ReplyContentView({
  supportResult,
  contentType,
  questionBody,
  replyBody,
  isWritingPending,
  onReplyBodyChange,
}: Readonly<ReplyContentViewProps>) {
  if (isWritingPending) {
    return (
      <div className='flex flex-1 items-center justify-center overflow-y-auto rounded border bg-white p-4'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500' />
      </div>
    );
  }

  if (contentType === 'preview') {
    return (
      <div className='flex-1 overflow-auto p-4'>
        <Markdown className='w-[calc(100%-3rem] prose prose-stone h-full break-words pr-[3rem]'>
          {supportResult === null ? replyBody : supportResult}
        </Markdown>
      </div>
    );
  }

  if (contentType === 'question') {
    return (
      <div className='flex-1 overflow-auto p-4'>
        <Markdown className='w-[calc(100%-3rem] prose prose-stone h-full break-words pr-[3rem]'>
          {questionBody}
        </Markdown>
      </div>
    );
  }

  return (
    <textarea
      className='flex-1 resize-none overflow-auto p-4 pr-[4rem] focus:outline-none'
      value={supportResult === null ? replyBody : supportResult}
      readOnly={supportResult !== null}
      onChange={(e) => onReplyBodyChange(e.target.value)}
      placeholder='답변을 남겨주세요.'
    />
  );
}
