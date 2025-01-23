import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { GrValidate } from 'react-icons/gr';
import { IoClose } from 'react-icons/io5';
import { useShallow } from 'zustand/react/shallow';

import { getSessionUsers } from '@/features/get-session-users';
import { patchSessionHost } from '@/features/update-session-host';

import { User, useSessionStore } from '@/entities/session';

import { Button } from '@/shared/ui/button';
import { Modal, useModalContext } from '@/shared/ui/modal';
import { useToastStore } from '@/shared/ui/toast';

interface ParticipantProps {
  user: User;
  onSelect: () => void;
}

function Participant({ user: { nickname, isHost }, onSelect }: ParticipantProps) {
  return (
    <div onClick={onSelect} className='w-full cursor-pointer rounded hover:bg-gray-200'>
      <div className='flex w-full flex-row items-center gap-2 p-2'>
        <GrValidate className={`flex-shrink-0 ${isHost ? 'text-indigo-600' : 'text-black-200'}`} />
        <span className='font-medium'>{nickname}</span>
      </div>
    </div>
  );
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className='relative w-full'>
      <input
        type='text'
        value={value}
        placeholder='유저 이름을 검색하세요'
        className='w-full rounded border-gray-500 p-2 pr-8 text-sm font-medium text-gray-500 focus:outline-none'
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <IoClose
          size={20}
          className='absolute right-2 top-2 cursor-pointer text-gray-500 transition-all duration-100 hover:scale-110 hover:text-gray-700'
          onClick={() => onChange('')}
        />
      )}
    </div>
  );
}

interface ConfirmHostChangeProps {
  user: User;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmHostChange({ user, onCancel, onConfirm }: ConfirmHostChangeProps) {
  return (
    <Modal className='h-[10dvh] w-[30dvw] min-w-[30dvw]'>
      <Modal.Body className='justify-center'>
        <div className='w-full text-center font-bold'>
          <span>
            <span className='text-indigo-600'>{user.nickname}</span>
            <span>님을</span>
          </span>
          <br />
          <span>{user.isHost ? '호스트를 해제하겠습니까?' : '호스트로 지정하겠습니까?'}</span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='w-full bg-gray-500' onClick={onCancel}>
          <div className='flex-grow text-sm font-medium text-white'>취소하기</div>
        </Button>
        <Button className='w-full bg-indigo-600 transition-colors duration-200' onClick={onConfirm}>
          <div className='flex-grow text-sm font-medium text-white'>{user.isHost ? '해제하기' : '지정하기'}</div>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

interface UserListProps {
  users: User[];
  searchQuery: string;
  onSearch: (value: string) => void;
  onSelectUser: (userId: number) => void;
  onClose: () => void;
}

function UserList({ users, searchQuery, onSearch, onSelectUser, onClose }: UserListProps) {
  return (
    <Modal>
      <Modal.Header className='flex-row items-center justify-between border-b border-gray-200 pb-2'>
        <span className='text-lg font-bold'>세션 참여자 정보</span>
        <IoClose
          size={24}
          className='cursor-pointer text-rose-600 transition-transform duration-100 hover:scale-110'
          onClick={onClose}
        />
      </Modal.Header>
      <Modal.Body className='h-[25dvh] gap-2'>
        <SearchBar value={searchQuery} onChange={onSearch} />
        <ol className='flex w-full flex-col gap-2 overflow-y-auto overflow-x-hidden'>
          {users.map((user) => (
            <Participant key={user.userId} user={user} onSelect={() => onSelectUser(user.userId)} />
          ))}
        </ol>
      </Modal.Body>
    </Modal>
  );
}

function useSessionParticipants() {
  const { closeModal } = useModalContext();
  const { sessionUsers, sessionId, sessionToken, setSessionUsers, updateSessionUser, updateReplyIsHost } =
    useSessionStore(
      useShallow((state) => ({
        sessionUsers: state.sessionUsers,
        sessionId: state.sessionId,
        sessionToken: state.sessionToken,
        setSessionUsers: state.setSessionUsers,
        updateSessionUser: state.updateSessionUser,
        updateReplyIsHost: state.updateReplyIsHost,
      })),
    );

  const addToast = useToastStore((state) => state.addToast);
  const [selectedUserId, setSelectedUserId] = useState<number>();
  const [searchQuery, setSearchQuery] = useState('');

  const selectedUser = sessionUsers.find(({ userId }) => userId === selectedUserId);
  const filteredUsers = sessionUsers.filter(({ nickname }) => nickname.includes(searchQuery));

  const { mutate: toggleHost, isPending: isToggleInProgress } = useMutation({
    mutationFn: (params: { userId: number; sessionId: string; token: string; isHost: boolean }) =>
      patchSessionHost(params.userId, {
        token: params.token,
        sessionId: params.sessionId,
        isHost: params.isHost,
      }),
    onSuccess: (res) => {
      updateReplyIsHost(res.user.userId, res.user.isHost);
      updateSessionUser(res.user);
      addToast({
        type: 'SUCCESS',
        message: `${res.user.nickname}님을 호스트${res.user.isHost ? '로 지정' : '에서 해제'}했습니다.`,
        duration: 3000,
      });
    },
    onError: (error) => {
      if (!isAxiosError(error)) return;
      if (error.response?.status === 400) {
        addToast({
          type: 'ERROR',
          message: '자신의 권한을 변경하려는 요청은 허용되지 않습니다.',
          duration: 3000,
        });
      } else if (error.response?.status === 403) {
        addToast({
          type: 'ERROR',
          message: '세션 생성자만 권한을 수정할 수 있습니다.',
          duration: 3000,
        });
      }
    },
    onSettled: () => {
      setSelectedUserId(undefined);
    },
  });

  const handleToggleHost = () => {
    if (!selectedUser || !sessionId || !sessionToken || isToggleInProgress) return;

    toggleHost({
      userId: selectedUser.userId,
      sessionId,
      token: sessionToken,
      isHost: !selectedUser.isHost,
    });
  };

  useEffect(() => {
    if (sessionId && sessionToken)
      getSessionUsers({ sessionId, token: sessionToken })
        .then(({ users }) => {
          setSessionUsers(users);
        })
        .catch(console.error);
  }, [sessionId, sessionToken, setSessionUsers]);

  return {
    selectedUser,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    setSelectedUserId,
    handleToggleHost,
    closeModal,
  };
}

function SessionParticipantsModal() {
  const { selectedUser, filteredUsers, searchQuery, setSearchQuery, setSelectedUserId, handleToggleHost, closeModal } =
    useSessionParticipants();

  return selectedUser ? (
    <ConfirmHostChange user={selectedUser} onCancel={() => setSelectedUserId(undefined)} onConfirm={handleToggleHost} />
  ) : (
    <UserList
      users={filteredUsers}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
      onSelectUser={setSelectedUserId}
      onClose={closeModal}
    />
  );
}

export default SessionParticipantsModal;
