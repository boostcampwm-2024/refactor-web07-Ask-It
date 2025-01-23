import QuestionDeleteButton from '@/widgets/question-list/ui/QuestionDeleteButton';
import QuestionEditButton from '@/widgets/question-list/ui/QuestionEditButton';
import QuestionLikeButton from '@/widgets/question-list/ui/QuestionLikeButton';
import QuestionPinButton from '@/widgets/question-list/ui/QuestionPinButton';
import ReplyCountButton from '@/widgets/question-list/ui/ReplyCountButton';

import { Question } from '@/entities/session';

interface QuestionActionsProps {
  question: Question;
  isHost: boolean;
  expired: boolean;
  onPin: () => void;
  onLike: () => void;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function QuestionActions({
  question,
  isHost,
  expired,
  onPin,
  onLike,
  onSelect,
  onEdit,
  onDelete,
}: QuestionActionsProps) {
  const canEdit = question.isOwner && !question.closed && question.replies.length === 0;
  const canDelete = isHost || (question.isOwner && !question.closed && question.replies.length === 0);
  const showActions = !expired && (isHost || question.isOwner);

  return (
    <div className='inline-flex w-full justify-between'>
      <div className='inline-flex items-center justify-start gap-2'>
        <QuestionPinButton isHost={isHost} expired={expired} pinned={question.pinned} onClick={onPin} />
        <QuestionLikeButton liked={question.liked} likesCount={question.likesCount} onClick={onLike} />
        <ReplyCountButton count={question.replies.length} onClick={onSelect} />
      </div>
      {showActions && (
        <div className='inline-flex items-center justify-start gap-2 px-2.5'>
          <QuestionEditButton isVisible={canEdit} onClick={onEdit} />
          <QuestionDeleteButton isVisible={canDelete} onClick={onDelete} />
        </div>
      )}
    </div>
  );
}

export default QuestionActions;
