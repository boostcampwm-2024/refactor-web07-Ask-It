import ReplyDeleteButton from '@/widgets/reply-list/ui/ReplyDeleteButton';
import ReplyEditButton from '@/widgets/reply-list/ui/ReplyEditButton';
import ReplyLikeButton from '@/widgets/reply-list/ui/ReplyLikeButton';

import { Reply } from '@/entities/session';

interface ReplyActionsProps {
  reply: Reply;
  expired: boolean;
  isHost: boolean;
  handleLike: () => void;
  openCreateReplyModal: () => void;
  openDeleteModal: () => void;
}

function ReplyActions({
  reply,
  expired,
  isHost,
  handleLike,
  openCreateReplyModal,
  openDeleteModal,
}: ReplyActionsProps) {
  if (reply.deleted) {
    return <ReplyLikeButton liked={reply.liked} likesCount={reply.likesCount} onClick={handleLike} />;
  }

  const showActions = !expired;
  const canDelete = isHost || reply.isOwner;

  return (
    <div className='inline-flex w-full items-center justify-between'>
      <ReplyLikeButton liked={reply.liked} likesCount={reply.likesCount} onClick={handleLike} />
      {showActions && (
        <div className='inline-flex items-center justify-start gap-2 px-2'>
          <ReplyEditButton isOwner={reply.isOwner} onClick={openCreateReplyModal} />
          <ReplyDeleteButton canDelete={canDelete} onClick={openDeleteModal} />
        </div>
      )}
    </div>
  );
}

export default ReplyActions;
