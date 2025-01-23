/* eslint-disable import/prefer-default-export */
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { SocketService } from '@/features/socket/model/socket.service';

import { useSessionStore } from '@/entities/session';

interface SocketContextType {
  socket?: SocketService;
}

export const SocketContext = createContext<SocketContextType>({});

export const useSocket = () => {
  const { socket } = useContext(SocketContext);
  return socket;
};

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const { expired, sessionId, sessionToken } = useSessionStore(
    useShallow((state) => ({
      expired: state.expired,
      sessionId: state.sessionId,
      sessionToken: state.sessionToken,
    })),
  );

  const [socket, setSocket] = useState<SocketService>();

  const value = useMemo(() => ({ socket }), [socket]);

  useEffect(() => {
    if (expired || !sessionId || !sessionToken) return () => {};

    const socketService = new SocketService(sessionId, sessionToken);

    setSocket(socketService);

    socketService.setupSubscriptions();

    return () => {
      socketService.disconnect();
    };
  }, [expired, sessionId, sessionToken]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
