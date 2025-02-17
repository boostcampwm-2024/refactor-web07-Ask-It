import { StateCreator } from 'zustand';

import { Chat } from '@/entities/session/model/chatting.type';

export interface ChattingSlice {
  chatting: Chat[];
  resetChatting: () => void;
  addChatting: (chat: Chat) => void;
  addChattingToFront: (chat: Chat) => void;
  updateChattingAbuse: (chattingId: number) => void;
}

export const createChattingSlice: StateCreator<ChattingSlice, [], [], ChattingSlice> = (set) => ({
  chatting: [],
  resetChatting: () => set({ chatting: [] }),
  addChatting: (chat) => set((state) => ({ chatting: [...state.chatting, chat] })),
  addChattingToFront: (chat) => set((state) => ({ chatting: [chat, ...state.chatting] })),
  updateChattingAbuse: (chattingId: number) =>
    set((state) => ({
      chatting: state.chatting.map((chat) => (chat.chattingId === chattingId ? { ...chat, abuse: true } : chat)),
    })),
});
