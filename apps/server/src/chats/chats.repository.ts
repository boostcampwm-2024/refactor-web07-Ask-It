import { Injectable } from '@nestjs/common';

import { PrismaService } from '@prisma-alias/prisma.service';

@Injectable()
export class ChatsRepository {
  constructor(private readonly prisma: PrismaService) {}

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
}
