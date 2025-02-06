import { useState } from 'react';

import { ContentType } from '@/features/create-update-reply/model/reply-modal.type';
import { useReplyMutation } from '@/features/create-update-reply/model/useReplyMutation';
import CreateReplyModalFooter from '@/features/create-update-reply/ui/CreateReplyModalFooter';
import CreateReplyModalSide from '@/features/create-update-reply/ui/CreateReplyModalSide';
import ReplyContentView from '@/features/create-update-reply/ui/ReplyContentView';

import { Question, Reply } from '@/entities/session';
import { getContentBodyLength, isValidBodyLength } from '@/entities/session/model/qna.util';

interface CreateReplyModalProps {
  question?: Question;
  reply?: Reply;
}

function CreateReplyModal({ question, reply }: Readonly<CreateReplyModalProps>) {
  const { body, setBody, handleSubmit, submitDisabled } = useReplyMutation(question, reply);

  const [contentType, setContentType] = useState<ContentType>('reply');

  const bodyLength = getContentBodyLength(body);

  const buttonEnabled = !submitDisabled && isValidBodyLength(bodyLength) && contentType !== 'question';

  return (
    <div className='relative flex h-[20rem] w-[40rem] flex-col rounded-lg bg-gray-50 p-4'>
      <div className='flex h-[15rem] flex-1 rounded border bg-white'>
        <ReplyContentView
          contentType={contentType}
          questionBody={question?.body ?? '질문을 찾을 수 없습니다.'}
          replyBody={body}
          onChange={setBody}
        />
        <CreateReplyModalSide bodyLength={bodyLength} contentType={contentType} setContentType={setContentType} />
      </div>
      <CreateReplyModalFooter reply={reply} buttonEnabled={buttonEnabled} handleSubmit={handleSubmit} />
    </div>
  );
}

export default CreateReplyModal;
