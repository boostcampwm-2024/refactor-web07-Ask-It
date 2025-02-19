import { Injectable } from '@nestjs/common';
import { AbuseState } from '@prisma/client';
import { PrismaService } from '@prisma-alias/prisma.service';

import { ChatSaveDto } from './chats.service';

@Injectable()
export class ChatsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async save({ sessionId, token, body }: ChatSaveDto) {
    return await this.prisma.chatting.create({
      data: { sessionId, createUserToken: token, body },
      include: {
        createUserTokenEntity: {
          select: {
            user: true,
          },
        },
      },
    });
  }

  async update(chattingId: number, abuse: AbuseState) {
    await this.prisma.chatting.update({
      where: { chattingId },
      data: { abuse },
    });
  }

  async getChatsForInfiniteScroll(sessionId: string, count: number, chatId?: number) {
    return await this.prisma.chatting.findMany({
      where: {
        sessionId,
        ...(chatId && { chattingId: { lt: chatId } }),
      },
      include: {
        createUserTokenEntity: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        chattingId: 'desc',
      },
      take: count,
    });
  }

  async getChatsForFilter(count: number, chatId: number) {
    return await this.prisma.chatting.findMany({
      where: {
        chattingId: { gt: chatId },
        abuse: AbuseState.PENDING,
      },
      take: count,
    });
  }
}
