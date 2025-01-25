import { useReplyMutation } from '@/features/create-update-reply/model/useReplyMutation';
import QuestionPreview from '@/features/create-update-reply/ui/QuestionPreview';
import ReplyContentEditor from '@/features/create-update-reply/ui/ReplyContentEditor';
import ReplyModalFooter from '@/features/create-update-reply/ui/ReplyModalFooter';
import ReplyModalHeader from '@/features/create-update-reply/ui/ReplyModalHeader';

import { Question, Reply } from '@/entities/session';

import { useModalContext } from '@/shared/ui/modal';

interface CreateReplyModalProps {
  question?: Question;
  reply?: Reply;
}

function CreateReplyModal({ question, reply }: Readonly<CreateReplyModalProps>) {
  const { closeModal } = useModalContext();
  const { body, setBody, handleSubmit, submitDisabled } = useReplyMutation(question, reply);

  return (
    <div className='flex h-[50dvh] w-[50dvw] flex-col gap-2 rounded-lg bg-gray-50 p-8'>
      <ReplyModalHeader />
      <hr className='my-1 border-gray-200' />
      <QuestionPreview question={question} />
      <hr className='my-1 border-gray-200' />
      <ReplyContentEditor body={body} setBody={setBody} />
      <ReplyModalFooter
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitDisabled={submitDisabled}
        submitText={reply ? '수정하기' : '생성하기'}
      />
    </div>
  );
}

export default CreateReplyModal;
