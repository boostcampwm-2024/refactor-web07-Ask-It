import { create } from 'zustand';

import { ChattingSlice, createChattingSlice } from '@/entities/session/model/chatting.slice';
import { createQnASlice, QnASlice } from '@/entities/session/model/qna.slice';
import { createSessionSlice, SessionSlice } from '@/entities/session/model/session.slice';

export type SessionStore = SessionSlice & QnASlice & ChattingSlice;

export const useSessionStore = create<SessionStore>()((...a) => ({
  ...createQnASlice(...a),
  ...createChattingSlice(...a),
  ...createSessionSlice(...a),
}));
