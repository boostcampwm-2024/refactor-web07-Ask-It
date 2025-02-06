import { isAxiosError } from 'axios';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GrValidate } from 'react-icons/gr';
import { IoClose, IoShareSocialOutline } from 'react-icons/io5';
import { useShallow } from 'zustand/react/shallow';

import QuestionSection from '@/widgets/question-list/ui/QuestionSection';
import SessionSettingsDropdown from '@/widgets/question-list/ui/SessionSettingsDropdown';

import { CreateQuestionModal } from '@/features/create-update-question';
import { SessionParticipantsModal } from '@/features/get-session-users';
import { useSocket } from '@/features/socket';
import { postSessionTerminate, SessionTerminateModal } from '@/features/terminate-session';

import { Question, useSessionStore } from '@/entities/session';

import { deepEqual } from '@/shared/model/deep-equal';
import { Button } from '@/shared/ui/button';
import { useModal } from '@/shared/ui/modal';
import { useToastStore } from '@/shared/ui/toast';

function QuestionList() {
  const { isHost, expired, questions, sessionId, sessionTitle, sessionToken, setExpired, setSelectedQuestionId } =
    useSessionStore(
      useShallow((state) => ({
        isHost: state.isHost,
        expired: state.expired,
        questions: state.questions,
        sessionId: state.sessionId,
        sessionTitle: state.sessionTitle,
        sessionToken: state.sessionToken,
        setExpired: state.setExpired,
        setSelectedQuestionId: state.setSelectedQuestionId,
      })),
    );

  const addToast = useToastStore((state) => state.addToast);

  const socket = useSocket();

  const { Modal: CreateQuestion, openModal: openCreateQuestionModal } = useModal(<CreateQuestionModal />, true);

  const { Modal: SessionParticipants, openModal: openSessionParticipantsModal } = useModal(
    <SessionParticipantsModal />,
  );

  const { Modal: SessionTerminate, openModal: openSessionTerminateModal } = useModal(
    <SessionTerminateModal
      onConfirm={() => {
        if (!sessionId || !sessionToken) return;

        postSessionTerminate({ sessionId, token: sessionToken })
          .then((response) => {
            if (response.expired) {
              socket?.disconnect();
              setExpired(true);
              addToast({
                type: 'SUCCESS',
                message: '세션이 종료되었습니다',
                duration: 3000,
              });
            }
          })
          .catch((err) => {
            if (isAxiosError(err) && err.response?.status === 403) {
              addToast({
                type: 'ERROR',
                message: '세션 생성자만 세션을 종료할 수 있습니다',
                duration: 3000,
              });
            }
          });
      }}
    />,
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const sessionButtons = useMemo(
    () => [
      {
        key: '공유',
        button: (
          <div className='flex w-full cursor-pointer flex-row items-center gap-2'>
            <IoShareSocialOutline />
            <p>공유</p>
          </div>
        ),
        onClick: () => {
          const shareUrl = `${window.location.origin}/session/${sessionId}`;

          navigator.clipboard
            .writeText(shareUrl)
            .then(() => {
              addToast({
                type: 'SUCCESS',
                message: '세션 링크가 클립보드에 복사되었습니다',
                duration: 3000,
              });
            })
            .catch(() => {
              addToast({
                type: 'ERROR',
                message: '링크 복사에 실패했습니다',
                duration: 3000,
              });
            });
        },
      },
      {
        key: '호스트 설정',
        button: (
          <div className='flex w-full cursor-pointer flex-row items-center gap-2'>
            <GrValidate />
            <p>호스트 설정</p>
          </div>
        ),
        onClick: () => openSessionParticipantsModal(),
      },
      {
        key: '세션 종료',
        button: (
          <div className='flex w-full cursor-pointer flex-row items-center gap-2 text-red-600'>
            <IoClose />
            <p>세션 종료</p>
          </div>
        ),
        onClick: () => openSessionTerminateModal(),
      },
    ],
    [sessionId, addToast, openSessionParticipantsModal, openSessionTerminateModal],
  );

  const [pinnedQuestions, setPinnedQuestions] = useState<Question[]>([]);
  const [unpinnedQuestions, setUnpinnedQuestions] = useState<Question[]>([]);
  const [closedQuestions, setClosedQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const updatedPinnedQuestions = questions
      .filter((question) => question.pinned && !question.closed)
      .sort((a, b) => b.likesCount - a.likesCount);

    const updatedUnpinnedQuestions = questions
      .filter((question) => !question.pinned && !question.closed)
      .sort((a, b) => b.likesCount - a.likesCount);

    const updatedClosedQuestions = questions
      .filter((question) => question.closed)
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.likesCount - a.likesCount;
      });

    if (!deepEqual(updatedPinnedQuestions, pinnedQuestions)) {
      setPinnedQuestions(updatedPinnedQuestions);
    }

    if (!deepEqual(updatedUnpinnedQuestions, unpinnedQuestions)) {
      setUnpinnedQuestions(updatedUnpinnedQuestions);
    }

    if (!deepEqual(updatedClosedQuestions, closedQuestions)) {
      setClosedQuestions(updatedClosedQuestions);
    }
  }, [questions, pinnedQuestions, unpinnedQuestions, closedQuestions]);

  return (
    <div className='inline-flex h-full w-4/5 flex-grow flex-col items-center justify-start rounded-lg bg-white shadow'>
      <div className='inline-flex h-[54px] w-full items-center justify-between border-b border-gray-200 px-8 py-2'>
        <div className='inline-flex h-full w-fit gap-4'>
          <div className='self-center text-lg font-medium text-black'>{sessionTitle}</div>
          <div className={`self-center rounded ${expired ? 'bg-red-100' : 'bg-green-100'} px-2 py-1`}>
            <p className={`text-xs font-medium ${expired ? 'text-red-600' : 'text-green-800'}`}>
              {expired ? '만료된 세션' : '진행 중인 세션'}
            </p>
          </div>
        </div>
        {!expired && (
          <div className='flex flex-row gap-2'>
            <div className='relative'>
              {isHost && (
                <Button
                  ref={buttonRef}
                  className='hover:bg-gray-200 hover:transition-all'
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <p className='text-sm font-bold text-black'>설정</p>
                </Button>
              )}
              {isHost && isDropdownOpen && (
                <SessionSettingsDropdown
                  buttons={sessionButtons}
                  onClose={() => setIsDropdownOpen(false)}
                  triggerRef={buttonRef}
                />
              )}
            </div>
            <Button className='bg-indigo-600' onClick={openCreateQuestionModal}>
              <div className='text-sm font-bold text-white'>질문하기</div>
            </Button>
          </div>
        )}
      </div>
      {questions.length === 0 ? (
        <div className='inline-flex h-full w-full select-none items-center justify-center'>
          <div className='font-header text-5xl opacity-30'>
            <span className='text-indigo-600'>A</span>
            <span className='text-black'>sk-It</span>
          </div>
        </div>
      ) : (
        <motion.div className='inline-flex h-full w-full flex-col items-start justify-start gap-4 overflow-y-auto px-8 py-4'>
          <QuestionSection
            title='고정된 질문'
            initialOpen={true}
            questions={pinnedQuestions}
            onQuestionSelect={setSelectedQuestionId}
          />
          <QuestionSection
            title='질문'
            initialOpen={true}
            questions={unpinnedQuestions}
            onQuestionSelect={setSelectedQuestionId}
          />
          <QuestionSection
            title='답변 완료된 질문'
            initialOpen={false}
            questions={closedQuestions}
            onQuestionSelect={setSelectedQuestionId}
          />
        </motion.div>
      )}
      {CreateQuestion}
      {SessionParticipants}
      {SessionTerminate}
    </div>
  );
}

export default QuestionList;
