import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { getSessionUsers } from '@/features/get-session-users/api/get-session-users.api';
import { patchSessionHost } from '@/features/update-session-host';

import { useSessionStore } from '@/entities/session';

import { useModalContext } from '@/shared/ui/modal';
import { useToastStore } from '@/shared/ui/toast';

export const useSessionParticipants = () => {
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
};
