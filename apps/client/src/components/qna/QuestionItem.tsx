import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { throttle } from 'es-toolkit';
import { useCallback } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { GoCheck } from 'react-icons/go';
import { GrClose, GrLike, GrLikeFill, GrPin } from 'react-icons/gr';
import { RiQuestionAnswerLine } from 'react-icons/ri';
import Markdown from 'react-markdown';
import { useShallow } from 'zustand/react/shallow';

import { useModal } from '@/features/modal';
import { useSessionStore } from '@/features/session';
import {
  deleteQuestion,
  patchQuestionClosed,
  patchQuestionPinned,
  postQuestionLike,
  Question,
} from '@/features/session/qna';
import { useToastStore } from '@/features/toast';

import { Button, CreateQuestionModal } from '@/components';
import DeleteConfirmModal from '@/components/modal/DeleteConfirmModal';

const useQuestionActions = (question: Question, onQuestionSelect: () => void) => {
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);

  const { sessionToken, sessionId, isHost, expired, removeQuestion, updateQuestion, setFromDetail } = useSessionStore(
    useShallow((state) => ({
      sessionToken: state.sessionToken,
      sessionId: state.sessionId,
      isHost: state.isHost,
      expired: state.expired,
      removeQuestion: state.removeQuestion,
      updateQuestion: state.updateQuestion,
      setFromDetail: state.setFromDetail,
    })),
  );

  const handleSelectQuestionId = () => {
    if (!sessionId) return;
    setFromDetail(true);
    onQuestionSelect();
    navigate({ to: `/session/${sessionId}/${question.questionId}` });
  };

  const { mutate: likeQuestionQuery, isPending: isLikeInProgress } = useMutation({
    mutationFn: (params: { questionId: number; token: string; sessionId: string }) =>
      postQuestionLike(params.questionId, {
        token: params.token,
        sessionId: params.sessionId,
      }),
    onSuccess: (res) => {
      addToast({
        type: 'SUCCESS',
        message: question.liked ? '좋아요를 취소했습니다.' : '질문에 좋아요를 눌렀습니다.',
        duration: 3000,
      });
      updateQuestion({
        ...question,
        ...res,
      });
    },
    onError: console.error,
  });

  const handleLike = useCallback(
    throttle(
      () => {
        if (expired || !sessionToken || !sessionId || isLikeInProgress) return;

        likeQuestionQuery({
          questionId: question.questionId,
          token: sessionToken,
          sessionId,
        });
      },
      1000,
      { edges: ['leading'] },
    ),
    [],
  );

  const { mutate: closeQuestionQuery, isPending: isCloseInProgress } = useMutation({
    mutationFn: (params: { questionId: number; token: string; sessionId: string; closed: boolean }) =>
      patchQuestionClosed(params.questionId, {
        token: params.token,
        sessionId: params.sessionId,
        closed: params.closed,
      }),
    onSuccess: () => {
      addToast({
        type: 'SUCCESS',
        message: question.closed ? '질문 답변 완료를 취소했습니다.' : '질문을 답변 완료했습니다.',
        duration: 3000,
      });
      updateQuestion({
        ...question,
        closed: !question.closed,
      });
    },
    onError: console.error,
  });

  const handleClose = () => {
    if (expired || !sessionToken || !sessionId || !isHost || isCloseInProgress) return;

    closeQuestionQuery({
      questionId: question.questionId,
      token: sessionToken,
      sessionId,
      closed: !question.closed,
    });
  };

  const { mutate: pinQuestionQuery, isPending: isPinInProgress } = useMutation({
    mutationFn: (params: { questionId: number; token: string; sessionId: string; pinned: boolean }) =>
      patchQuestionPinned(params.questionId, {
        token: params.token,
        sessionId: params.sessionId,
        pinned: params.pinned,
      }),
    onSuccess: () => {
      addToast({
        type: 'SUCCESS',
        message: question.pinned ? '질문 고정을 취소했습니다.' : '질문을 고정했습니다.',
        duration: 3000,
      });
      updateQuestion({
        ...question,
        pinned: !question.pinned,
      });
    },
    onError: console.error,
  });

  const handlePin = () => {
    if (expired || !sessionToken || !sessionId || !isHost || isPinInProgress) return;

    pinQuestionQuery({
      questionId: question.questionId,
      token: sessionToken,
      sessionId,
      pinned: !question.pinned,
    });
  };

  const { mutate: deleteQuestionQuery, isPending: isDeleteInProgress } = useMutation({
    mutationFn: (params: { questionId: number; sessionId: string; token: string }) =>
      deleteQuestion(params.questionId, {
        sessionId: params.sessionId,
        token: params.token,
      }),
    onSuccess: () => {
      addToast({
        type: 'SUCCESS',
        message: '질문을 삭제했습니다.',
        duration: 3000,
      });
      removeQuestion(question.questionId);
    },
    onError: console.error,
  });

  const handleDelete = () => {
    if (expired || !sessionToken || !sessionId || isDeleteInProgress) return;

    deleteQuestionQuery({
      questionId: question.questionId,
      sessionId,
      token: sessionToken,
    });
  };

  return {
    isHost,
    expired,
    sessionId,
    handleLike,
    handleClose,
    handlePin,
    handleDelete,
    handleSelectQuestionId,
  };
};

function QuestionBody({
  body,
  closed,
  isHost,
  expired,
  onClose,
}: {
  body: string;
  closed: boolean;
  isHost: boolean;
  expired: boolean;
  onClose: () => void;
}) {
  return (
    <div className='flex h-fit flex-col items-start justify-start gap-2 self-stretch border-b border-gray-200 px-2.5 pb-4 pt-2.5'>
      <div className='inline-flex items-start justify-between gap-4 self-stretch'>
        <Markdown className='prose prose-stone flex h-full w-full flex-col justify-start gap-3 text-base font-medium leading-normal text-black prose-img:rounded-md'>
          {body}
        </Markdown>
        {!expired && (isHost || (!isHost && closed)) && (
          <Button
            onClick={onClose}
            className={`self-start transition-colors duration-200 ${
              closed ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'
            }`}
          >
            <div className={`self-start text-base font-medium ${closed ? 'text-green-800' : 'text-red-800'}`}>
              <GoCheck />
            </div>
          </Button>
        )}
      </div>
    </div>
  );
}

function PinButton({
  isHost,
  expired,
  pinned,
  onClick,
}: {
  isHost: boolean;
  expired: boolean;
  pinned: boolean;
  onClick: () => void;
}) {
  if (expired || !isHost) return null;

  return (
    <Button className='hover:bg-gray-200/50 hover:transition-all' onClick={onClick}>
      <div className='flex flex-row items-center gap-2 text-sm font-medium text-gray-500'>
        <GrPin />
        <span>{pinned ? '고정 해제' : '고정'}</span>
      </div>
    </Button>
  );
}

function LikeButton({ liked, likesCount, onClick }: { liked: boolean; likesCount: number; onClick: () => void }) {
  return (
    <Button className='hover:bg-gray-200/50 hover:transition-all' onClick={onClick}>
      <div className='flex flex-row items-center gap-2 text-sm font-medium text-gray-500'>
        {liked ? <GrLikeFill style={{ fill: 'rgb(165 180 252)' }} /> : <GrLike />}
        <span>{likesCount}</span>
      </div>
    </Button>
  );
}

function ReplyCountButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <Button className='hover:bg-gray-200/50 hover:transition-all' onClick={onClick}>
      <div className='flex flex-row items-center gap-2 text-sm font-medium text-gray-500'>
        <RiQuestionAnswerLine />
        <span>답글 {count}</span>
      </div>
    </Button>
  );
}

function EditButton({ isVisible, onClick }: { isVisible: boolean; onClick: () => void }) {
  if (!isVisible) return null;

  return (
    <Button
      className='bg-gray-200/25 font-medium text-gray-500 hover:bg-gray-200/50 hover:transition-all'
      onClick={onClick}
    >
      <FiEdit2 />
    </Button>
  );
}

function DeleteButton({ isVisible, onClick }: { isVisible: boolean; onClick: () => void }) {
  if (!isVisible) return null;

  return (
    <Button className='bg-red-200/25 text-red-600 hover:bg-red-200/50 hover:transition-all' onClick={onClick}>
      <GrClose />
    </Button>
  );
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
}: {
  question: Question;
  isHost: boolean;
  expired: boolean;
  onPin: () => void;
  onLike: () => void;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const canEdit = question.isOwner && !question.closed && question.replies.length === 0;
  const canDelete = isHost || (question.isOwner && !question.closed && question.replies.length === 0);
  const showActions = !expired && (isHost || question.isOwner);

  return (
    <div className='inline-flex w-full justify-between'>
      <div className='inline-flex items-center justify-start gap-2'>
        <PinButton isHost={isHost} expired={expired} pinned={question.pinned} onClick={onPin} />
        <LikeButton liked={question.liked} likesCount={question.likesCount} onClick={onLike} />
        <ReplyCountButton count={question.replies.length} onClick={onSelect} />
      </div>
      {showActions && (
        <div className='inline-flex items-center justify-start gap-2 px-2.5'>
          <EditButton isVisible={canEdit} onClick={onEdit} />
          <DeleteButton isVisible={canDelete} onClick={onDelete} />
        </div>
      )}
    </div>
  );
}

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
