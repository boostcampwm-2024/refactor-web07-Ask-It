import { useQuestionMutation } from '@/features/create-update-question/model/useQuestionMutation';
import QuestionContentEditor from '@/features/create-update-question/ui/QuestionContentEditor';
import QuestionModalFooter from '@/features/create-update-question/ui/QuestionModalFooter';
import QuestionModalHeader from '@/features/create-update-question/ui/QuestionModalHeader';

import { Question } from '@/entities/session';

import { useModalContext } from '@/shared/ui/modal';

interface CreateQuestionModalProps {
  question?: Question;
}

function CreateQuestionModal({ question }: Readonly<CreateQuestionModalProps>) {
  const { closeModal } = useModalContext();
  const { body, setBody, handleSubmit, submitDisabled } = useQuestionMutation(question);

  return (
    <div className='flex h-[50dvh] w-[50dvw] flex-col gap-2 rounded-lg bg-gray-50 p-8'>
      <QuestionModalHeader />
      <hr className='my-1 border-gray-200' />
      <QuestionContentEditor body={body} setBody={setBody} />
      <QuestionModalFooter
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitDisabled={submitDisabled}
        submitText={question ? '수정하기' : '생성하기'}
      />
    </div>
  );
}

export default CreateQuestionModal;
