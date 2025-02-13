import { MdQuestionMark } from 'react-icons/md';
import { RiQuestionAnswerLine } from 'react-icons/ri';
import { VscEdit, VscMarkdown } from 'react-icons/vsc';

import { ContentType } from '@/features/create-update-reply/model/reply-modal.type';

import { Popover } from '@/shared/ui/popover';

interface CreateReplyModalSideProps {
  bodyLength: number;
  contentType: ContentType;
  setContentType: (contentType: ContentType) => void;
}

const textSize = (bodyLength: number) => {
  if (bodyLength >= 10000) {
    return 'text-[0.5rem] leading-3';
  } else if (bodyLength >= 1000) {
    return 'text-xs';
  }
  return 'text-sm';
};

export default function CreateReplyModalSide({
  bodyLength,
  contentType,
  setContentType,
}: Readonly<CreateReplyModalSideProps>) {
  return (
    <div className='absolute right-8 flex h-[calc(100%-5rem)] w-12 flex-col items-center justify-between py-4'>
      <div className='flex flex-col items-center gap-2'>
        {(contentType === 'reply' || contentType === 'question') && (
          <Popover text={contentType === 'question' ? '답변으로 전환' : '질문으로 전환'} position='right'>
            <button
              className='flex h-10 w-10 items-center justify-center rounded-full border p-2 shadow-md'
              onClick={() => setContentType(contentType === 'reply' ? 'question' : 'reply')}
            >
              {contentType === 'question' ? <RiQuestionAnswerLine size={32} /> : <MdQuestionMark size={32} />}
            </button>
          </Popover>
        )}
        {(contentType === 'reply' || contentType === 'preview') && (
          <Popover text={contentType === 'preview' ? '마크다운 편집' : '마크다운 미리보기'} position='right'>
            <button
              className='flex h-10 w-10 items-center justify-center rounded-full border p-2 shadow-md'
              onClick={() => setContentType(contentType === 'reply' ? 'preview' : 'reply')}
            >
              {contentType === 'reply' ? <VscMarkdown size={32} /> : <VscEdit size={32} />}
            </button>
          </Popover>
        )}
      </div>
      <span className={`${bodyLength > 500 ? 'text-red-600' : 'text-slate-400'} ${textSize(bodyLength)}`}>
        {bodyLength}/500
      </span>
    </div>
  );
}
