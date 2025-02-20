import { io, Socket } from 'socket.io-client';
import { z } from 'zod';

import { useAuthStore } from '@/features/auth';
import {
  ChatErrorEventPayload,
  ChatMessageEventPayload,
  ChattingFilteredEventPayload,
  HostChangedEventPayload,
  ParticipantCountUpdatedEventPayload,
  QuestionCreatedEventPayload,
  QuestionDeletedEventPayload,
  QuestionLikedEventPayload,
  QuestionUpdatedEventPayload,
  ReplyCreatedEventPayload,
  ReplyDeletedEventPayload,
  ReplyLikedEventPayload,
  ReplyUpdatedEventPayload,
} from '@/features/socket/model/socket.type';

import { useSessionStore } from '@/entities/session';

import { useToastStore } from '@/shared/ui/toast';

export class SocketService {
  private readonly socket: Socket;

  constructor(sessionId: string, token: string) {
    this.socket = io(import.meta.env.VITE_SOCKET_URL, {
      query: {
        sessionId,
        token,
      },
    });
  }

  public setupSubscriptions() {
    const store = useSessionStore.getState();
    const authStore = useAuthStore.getState();

    this.socket.on('questionCreated', (payload: QuestionCreatedEventPayload) => {
      store.addQuestion({ ...payload.question, isOwner: false });
    });

    this.socket.on('questionUpdated', (payload: QuestionUpdatedEventPayload) => {
      store.updateQuestion(payload.question);
    });

    this.socket.on('questionDeleted', (payload: QuestionDeletedEventPayload) => {
      store.removeQuestion(payload.questionId);
    });

    this.socket.on('questionLiked', ({ questionId, likesCount }: QuestionLikedEventPayload) => {
      store.updateQuestion({
        questionId,
        likesCount,
      });
    });

    this.socket.on('replyCreated', (payload: ReplyCreatedEventPayload) => {
      store.addReply(payload.reply.questionId, {
        ...payload.reply,
        isOwner: false,
      });
    });

    this.socket.on('replyUpdated', (payload: ReplyUpdatedEventPayload) => {
      store.updateReply(payload.reply.questionId, payload.reply);
    });

    this.socket.on('replyDeleted', (payload: ReplyDeletedEventPayload) => {
      store.updateReply(payload.questionId, {
        replyId: payload.replyId,
        deleted: true,
      });
    });

    this.socket.on('replyLiked', ({ questionId, replyId, likesCount }: ReplyLikedEventPayload) => {
      store.updateReply(questionId, {
        replyId,
        likesCount,
      });
    });

    this.socket.on('chatMessage', (payload: ChatMessageEventPayload) => {
      store.addChatting(payload);
    });

    this.socket.on('chatError', (payload: ChatErrorEventPayload) => {
      useToastStore.getState().addToast({
        type: 'ERROR',
        message: payload.message,
        duration: 3000,
      });
    });

    this.socket.on('duplicatedConnection', () => {
      // eslint-disable-next-line no-alert
      window.alert('다른 곳에서 세션에 접속하여 연결을 종료합니다.');
      window.location.href = '/';
    });

    this.socket.on('participantCountUpdated', (payload: ParticipantCountUpdatedEventPayload) => {
      store.setParticipantCount(payload.participantCount);
    });

    this.socket.on('hostChanged', ({ user: { nickname, userId, isHost } }: HostChangedEventPayload) => {
      if (userId === authStore.userId) store.setIsHost(isHost);
      store.updateReplyIsHost(userId, isHost);
      if (isHost)
        useToastStore.getState().addToast({
          type: 'INFO',
          message: `${nickname}님이 호스트로 지정되었습니다.`,
          duration: 3000,
        });
    });

    this.socket.on('sessionEnded', () => {
      store.setExpired(true);
      useToastStore.getState().addToast({
        type: 'INFO',
        message: '세션이 종료되었습니다.',
        duration: 3000,
      });
      this.socket.disconnect();
    });

    this.socket.on('chattingFiltered', ({ chattingIds }: ChattingFilteredEventPayload) => {
      chattingIds.forEach(store.updateChattingAbuse);
    });
  }

  sendChatMessage(message: string) {
    const chatMessageSchema = z.string().min(1);

    const result = chatMessageSchema.safeParse(message);
    if (!result.success) {
      useToastStore.getState().addToast({
        type: 'ERROR',
        message: '메시지를 입력해주세요',
        duration: 3000,
      });
      return;
    }

    this.socket.emit('createChat', message);
  }

  public disconnect() {
    this.socket.disconnect();
  }
}
