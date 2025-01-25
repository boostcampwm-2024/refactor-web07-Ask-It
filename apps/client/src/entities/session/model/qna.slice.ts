import { StateCreator } from 'zustand';

import { Question, Reply } from '@/entities/session/model/qna.type';

export interface QnASlice {
  questions: Question[];
  resetQuestions: () => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (question: Partial<Omit<Question, 'questionId'>> & { questionId: number }) => void;
  removeQuestion: (questionId: Question['questionId']) => void;
  addReply: (questionId: number, reply: Reply) => void;
  updateReply: (questionId: number, reply: Partial<Omit<Reply, 'replyId'>> & { replyId: number }) => void;
  removeReply: (replyId: Reply['replyId']) => void;
  updateReplyIsHost: (userId: number, isHost: boolean) => void;
}

export const createQnASlice: StateCreator<QnASlice, [], [], QnASlice> = (set) => ({
  questions: [],
  resetQuestions: () => set({ questions: [] }),
  addQuestion: (question) => set((state) => ({ ...state, questions: [...state.questions, question] })),
  updateQuestion: (question) =>
    set((state) => ({
      ...state,
      questions: state.questions.map((q) => (q.questionId === question.questionId ? { ...q, ...question } : q)),
    })),
  removeQuestion: (questionId) =>
    set((state) => ({
      ...state,
      questions: state.questions.filter((q) => q.questionId !== questionId),
    })),
  addReply: (questionId, reply) =>
    set((state) => ({
      ...state,
      questions: state.questions.map((q) =>
        q.questionId === questionId ? { ...q, replies: [...q.replies, reply] } : q,
      ),
    })),
  updateReply: (questionId, reply) => {
    const updateReplies = (replies: Reply[]) =>
      replies.map((r) => (r.replyId === reply.replyId ? { ...r, ...reply } : r));

    set((state) => ({
      ...state,
      questions: state.questions.map((q) =>
        q.questionId === questionId ? { ...q, replies: updateReplies(q.replies) } : q,
      ),
    }));
  },
  removeReply: (replyId) => {
    const filterReplies = (replies: Reply[]) => replies.filter((r) => r.replyId !== replyId);

    set((state) => ({
      ...state,
      questions: state.questions.map((q) => ({
        ...q,
        replies: filterReplies(q.replies),
      })),
    }));
  },
  updateReplyIsHost: (userId, isHost) => {
    const updateHostStatus = (replies: Reply[]) => replies.map((r) => (r.userId === userId ? { ...r, isHost } : r));

    set((state) => ({
      ...state,
      questions: state.questions.map((q) => ({
        ...q,
        replies: updateHostStatus(q.replies),
      })),
    }));
  },
});
