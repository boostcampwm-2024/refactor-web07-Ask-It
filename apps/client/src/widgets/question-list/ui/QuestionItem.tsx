import { useQuestionActions } from '@/widgets/question-list/model/useQuestionActions';
import QuestionBody from '@/widgets/question-list/ui/QuestionBody';
import QuestionDeleteButton from '@/widgets/question-list/ui/QuestionDeleteButton';
import QuestionEditButton from '@/widgets/question-list/ui/QuestionEditButton';
import QuestionLikeButton from '@/widgets/question-list/ui/QuestionLikeButton';
import QuestionPinButton from '@/widgets/question-list/ui/QuestionPinButton';
import ReplyCountButton from '@/widgets/question-list/ui/ReplyCountButton';

import { CreateQuestionModal } from '@/features/create-update-question';
import { DeleteConfirmModal } from '@/features/delete-question';

import { Question } from '@/entities/session';

import { useModal } from '@/shared/ui/modal';

interface QuestionItemProps {
  question: Question;
  onQuestionSelect: () => void;
}

function QuestionItem({ question, onQuestionSelect }: QuestionItemProps) {
  const { isHost, expired, handleLike, handleClose, handlePin, handleDelete, handleSelectQuestionId } =
    useQuestionActions(question, onQuestionSelect);

  const { Modal: CreateQuestion, openModal: openCreateQuestionModal } = useModal(
    <CreateQuestionModal question={question} />,
  );

  const { Modal: DeleteConfirm, openModal: openDeleteConfirmModal } = useModal(
    <DeleteConfirmModal onConfirm={handleDelete} />,
  );

  const canEdit = question.isOwner && !question.closed && question.replies.length === 0;
  const canDelete = isHost || (question.isOwner && !question.closed && question.replies.length === 0);
  const showActions = !expired && (isHost || question.isOwner);

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

      <div className='inline-flex w-full justify-between'>
        <div className='inline-flex items-center justify-start gap-2'>
          <QuestionPinButton isHost={isHost} expired={expired} pinned={question.pinned} onClick={handlePin} />
          <QuestionLikeButton liked={question.liked} likesCount={question.likesCount} onClick={handleLike} />
          <ReplyCountButton count={question.replies.length} onClick={handleSelectQuestionId} />
        </div>
        {showActions && (
          <div className='inline-flex items-center justify-start gap-2 px-2.5'>
            <QuestionEditButton isVisible={canEdit} onClick={openCreateQuestionModal} />
            <QuestionDeleteButton isVisible={canDelete} onClick={openDeleteConfirmModal} />
          </div>
        )}
      </div>
      {CreateQuestion}
      {DeleteConfirm}
    </div>
  );
}

export default QuestionItem;
