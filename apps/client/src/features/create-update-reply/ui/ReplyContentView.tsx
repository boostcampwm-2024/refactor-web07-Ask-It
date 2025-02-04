import Markdown from 'react-markdown';

import { ContentType } from '@/features/create-update-reply/model/reply-modal.type';

import { Question, Reply } from '@/entities/session';

interface ReplyContentViewProps {
  contentType: ContentType;
  questionBody: Question['body'];
  replyBody: Reply['body'];
  onChange: (body: string) => void;
}

export default function ReplyContentView({
  contentType,
  questionBody,
  replyBody,
  onChange,
}: Readonly<ReplyContentViewProps>) {
  if (contentType === 'preview') {
    return (
      <div className='flex-1 overflow-y-auto rounded border bg-white p-4'>
        <Markdown className='prose prose-stone'>{replyBody}</Markdown>
      </div>
    );
  }

  if (contentType === 'question') {
    return (
      <div className='flex-1 overflow-y-auto rounded border bg-white p-4'>
        <Markdown className='prose prose-stone'>{questionBody}</Markdown>
      </div>
    );
  }

  return (
    <textarea
      className='flex-1 resize-none rounded border p-4 focus:outline-none'
      value={replyBody}
      onChange={(e) => onChange(e.target.value)}
      placeholder='답변을 남겨주세요.'
    />
  );
}
