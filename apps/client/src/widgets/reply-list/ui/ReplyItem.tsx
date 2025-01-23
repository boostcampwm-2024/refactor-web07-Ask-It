import { useReplyActions } from '@/widgets/reply-list/model/useReplyActions';
import ReplyActions from '@/widgets/reply-list/ui/ReplyActions';
import ReplyBody from '@/widgets/reply-list/ui/ReplyBody';
import ReplyHeader from '@/widgets/reply-list/ui/ReplyHeader';

import { CreateReplyModal } from '@/features/create-update-reply';
import { DeleteConfirmModal } from '@/features/delete-question';

import { Question, Reply } from '@/entities/session';

import { useModal } from '@/shared/ui/modal';

interface ReplyItemProps {
  question: Question;
  reply: Reply;
}

function ReplyItem({ question, reply }: ReplyItemProps) {
  const { isHost, expired, handleLike, handleDelete } = useReplyActions(question, reply);

  const { Modal: CreateReply, openModal: openCreateReplyModal } = useModal(
    <CreateReplyModal question={question} reply={reply} />,
  );

  const { Modal: DeleteModal, openModal: openDeleteModal } = useModal(<DeleteConfirmModal onConfirm={handleDelete} />);

  return (
    <div className='flex shrink basis-0 flex-col items-start justify-start gap-4 self-stretch px-12'>
      <div className='flex h-fit flex-col items-start justify-start gap-2 self-stretch rounded-md bg-gray-50 p-4'>
        <div className='flex h-fit flex-col items-start justify-start gap-1 self-stretch border-b border-gray-200 pb-2'>
          <ReplyHeader reply={reply} />
          <ReplyBody reply={reply} />
        </div>
        <ReplyActions
          reply={reply}
          expired={expired}
          isHost={isHost}
          handleLike={handleLike}
          openCreateReplyModal={openCreateReplyModal}
          openDeleteModal={openDeleteModal}
        />
      </div>
      {CreateReply}
      {DeleteModal}
    </div>
  );
}

export default ReplyItem;
