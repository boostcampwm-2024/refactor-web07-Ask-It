import { useMutation } from '@tanstack/react-query';
import { throttle } from 'es-toolkit';
import { useCallback } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { GrClose, GrLike, GrLikeFill, GrValidate } from 'react-icons/gr';
import Markdown from 'react-markdown';
import { useShallow } from 'zustand/react/shallow';

import { CreateReplyModal } from '@/features/create-update-reply';
import { DeleteConfirmModal } from '@/features/delete-question';
import { deleteReply } from '@/features/delete-reply';
import { postReplyLike } from '@/features/like-reply';

import { Question, Reply, useSessionStore } from '@/entities/session';

import { Button } from '@/shared/ui/button';
import { useModal } from '@/shared/ui/modal';
import { useToastStore } from '@/shared/ui/toast';

const useReplyActions = (question: Question, reply: Reply) => {
  const addToast = useToastStore((state) => state.addToast);

  const { sessionId, sessionToken, isHost, expired, updateReply } = useSessionStore(
    useShallow((state) => ({
      sessionId: state.sessionId,
      sessionToken: state.sessionToken,
      isHost: state.isHost,
      expired: state.expired,
      updateReply: state.updateReply,
    })),
  );

  const { mutate: postReplyLikeQuery, isPending: isLikeInProgress } = useMutation({
    mutationFn: (params: { replyId: number; sessionId: string; token: string }) =>
      postReplyLike(params.replyId, {
        sessionId: params.sessionId,
        token: params.token,
      }),
    onSuccess: (res) => {
      addToast({
        type: 'SUCCESS',
        message: reply.liked ? '좋아요를 취소했습니다.' : '답변에 좋아요를 눌렀습니다.',
        duration: 3000,
      });
      updateReply(question.questionId, {
        ...reply,
        ...res,
      });
    },
    onError: console.error,
  });

  const handleLike = useCallback(
    throttle(
      () => {
        if (expired || !sessionId || !sessionToken || isLikeInProgress || reply.deleted) return;
        postReplyLikeQuery({
          replyId: reply.replyId,
          sessionId,
          token: sessionToken,
        });
      },
      1000,
      { edges: ['leading'] },
    ),
    [],
  );

  const { mutate: deleteReplyQuery, isPending: isDeleteInProgress } = useMutation({
    mutationFn: (params: { replyId: number; sessionId: string; token: string }) =>
      deleteReply(params.replyId, {
        sessionId: params.sessionId,
        token: params.token,
      }),
    onSuccess: () => {
      addToast({
        type: 'SUCCESS',
        message: '답변이 성공적으로 삭제되었습니다.',
        duration: 3000,
      });
      updateReply(question.questionId, {
        ...reply,
        deleted: true,
      });
    },
    onError: console.error,
  });

  const handleDelete = () => {
    if (expired || !sessionId || !sessionToken || isDeleteInProgress) return;
    deleteReplyQuery({
      replyId: reply.replyId,
      sessionId,
      token: sessionToken,
    });
  };

  return {
    isHost,
    expired,
    handleLike,
    handleDelete,
  };
};

function ReplyHeader({ reply }: { reply: Pick<Reply, 'deleted' | 'isHost' | 'nickname'> }) {
  const nickname = reply.deleted ? '알 수 없음' : reply.nickname;
  const showHostBadge = !reply.deleted && reply.isHost;

  return (
    <div className='flex flex-row items-center gap-1 text-indigo-600'>
      {showHostBadge && <GrValidate size={18} />}
      <span className='w-full text-base font-bold leading-normal text-black'>{nickname}</span>
    </div>
  );
}

function ReplyBody({ reply }: { reply: Pick<Reply, 'body' | 'deleted'> }) {
  const replyContent = reply.deleted ? '삭제된 답변입니다' : reply.body;

  return (
    <Markdown className='prose prose-stone flex h-full w-full flex-col justify-start gap-3 text-base font-medium leading-normal text-black prose-img:rounded-md'>
      {replyContent}
    </Markdown>
  );
}

interface ReplyActionsProps {
  reply: Reply;
  expired: boolean;
  isHost: boolean;
  handleLike: () => void;
  openCreateReplyModal: () => void;
  openDeleteModal: () => void;
}

function EditButton({ isOwner, onClick }: { isOwner: boolean; onClick: () => void }) {
  if (!isOwner) return null;

  return (
    <Button className='bg-gray-200/25 hover:bg-gray-200/50 hover:transition-all' onClick={onClick}>
      <FiEdit2 />
    </Button>
  );
}

function DeleteButton({ canDelete, onClick }: { canDelete: boolean; onClick: () => void }) {
  if (!canDelete) return null;

  return (
    <Button className='bg-red-200/25 text-red-600 hover:bg-red-200/50 hover:transition-all' onClick={onClick}>
      <GrClose />
    </Button>
  );
}

function LikeButton({ liked, likesCount, onClick }: { liked: boolean; likesCount: number; onClick: () => void }) {
  const LikeIcon = liked ? <GrLikeFill style={{ fill: 'rgb(165 180 252)' }} /> : <GrLike />;

  return (
    <Button className='hover:bg-gray-200/50 hover:transition-all' onClick={onClick}>
      <div className='flex flex-row items-center gap-2 text-sm font-medium text-gray-500'>
        {LikeIcon}
        <span>{likesCount}</span>
      </div>
    </Button>
  );
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
    return <LikeButton liked={reply.liked} likesCount={reply.likesCount} onClick={handleLike} />;
  }

  const showActions = !expired;
  const canDelete = isHost || reply.isOwner;

  return (
    <div className='inline-flex w-full items-center justify-between'>
      <LikeButton liked={reply.liked} likesCount={reply.likesCount} onClick={handleLike} />
      {showActions && (
        <div className='inline-flex items-center justify-start gap-2 px-2'>
          <EditButton isOwner={reply.isOwner} onClick={openCreateReplyModal} />
          <DeleteButton canDelete={canDelete} onClick={openDeleteModal} />
        </div>
      )}
    </div>
  );
}

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
