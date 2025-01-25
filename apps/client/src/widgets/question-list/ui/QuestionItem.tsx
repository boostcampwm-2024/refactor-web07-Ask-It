import { useQuestionActions } from '@/widgets/question-list/model/useQuestionActions';
import QuestionActions from '@/widgets/question-list/ui/QuestionActions';
import QuestionBody from '@/widgets/question-list/ui/QuestionBody';

import { CreateQuestionModal } from '@/features/create-update-question';
import { DeleteConfirmModal } from '@/features/delete-question';

import { Question } from '@/entities/session';

import { useModal } from '@/shared/ui/modal';

interface QuestionItemProps {
  question: Question;
  onQuestionSelect: () => void;
}

function QuestionItem({ question, onQuestionSelect }: Readonly<QuestionItemProps>) {
  const { isHost, expired, handleLike, handleClose, handlePin, handleDelete, handleSelectQuestionId } =
    useQuestionActions(question, onQuestionSelect);

  const { Modal: CreateQuestion, openModal: openCreateQuestionModal } = useModal(
    <CreateQuestionModal question={question} />,
  );

  const { Modal: DeleteConfirm, openModal: openDeleteConfirmModal } = useModal(
    <DeleteConfirmModal onConfirm={handleDelete} />,
  );

  return (
    <div
      className={`inline-flex h-fit w-full flex-col items-start justify-start gap-4 rounded-lg border ${question.pinned ? 'border-indigo-200' : 'border-gray-200'} bg-white px-4 py-2`}
    >
      <QuestionBody
        body={question.body}
        closed={question.closed}
        isHost={isHost}
        expired={expired}
        onClose={handleClose}
      />
      <QuestionActions
        question={question}
        isHost={isHost}
        expired={expired}
        onPin={handlePin}
        onLike={handleLike}
        onSelect={handleSelectQuestionId}
        onEdit={openCreateQuestionModal}
        onDelete={openDeleteConfirmModal}
      />
      {CreateQuestion}
      {DeleteConfirm}
    </div>
  );
}

export default QuestionItem;
