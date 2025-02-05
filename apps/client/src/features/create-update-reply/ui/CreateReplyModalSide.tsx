import { MdQuestionMark } from 'react-icons/md';
import { RiQuestionAnswerLine } from 'react-icons/ri';
import { VscEdit, VscMarkdown } from 'react-icons/vsc';

import { ContentType } from '@/features/create-update-reply/model/reply-modal.type';

interface CreateReplyModalSideProps {
  bodyLength: number;
  contentType: ContentType;
  setContentType: (contentType: ContentType) => void;
}

export default function CreateReplyModalSide({
  bodyLength,
  contentType,
  setContentType,
}: Readonly<CreateReplyModalSideProps>) {
  return (
    <div className='absolute right-8 flex h-[calc(100%-5rem)] flex-col items-center justify-between py-4'>
      <div className='flex flex-col items-center gap-2'>
        {(contentType === 'reply' || contentType === 'question') && (
          <button
            className='flex h-10 w-10 items-center justify-center rounded-full border p-2 shadow-md'
            onClick={() => setContentType(contentType === 'reply' ? 'question' : 'reply')}
          >
            {contentType === 'question' ? <RiQuestionAnswerLine size={32} /> : <MdQuestionMark size={32} />}
          </button>
        )}
        {(contentType === 'reply' || contentType === 'preview') && (
          <button
            className='flex h-10 w-10 items-center justify-center rounded-full border p-2 shadow-md'
            onClick={() => setContentType(contentType === 'reply' ? 'preview' : 'reply')}
          >
            {contentType === 'reply' ? <VscEdit size={32} /> : <VscMarkdown size={32} />}
          </button>
        )}
      </div>
      <span className={`text-xs ${bodyLength > 500 ? 'text-red-600' : 'text-slate-400'}`}>{bodyLength}/500</span>
    </div>
  );
}
