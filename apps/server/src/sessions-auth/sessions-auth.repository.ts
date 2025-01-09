import { Injectable } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';

import { Roles } from '@common/roles/roles';
import { PrismaService } from '@prisma-alias/prisma.service';

@Injectable()
export class SessionsAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async generateToken(userId: number | null, sessionId: string, roleType: keyof typeof Roles = Roles.PARTICIPANT) {
    const newUserSessionToken = await this.prisma.userSessionToken.create({
      data: {
        sessionId,
        userId: userId ? userId : null,
        token: uuid4(),
        roleType,
      },
    });
    return newUserSessionToken.token;
  }

  async findTokenByUserId(userId: number, sessionId: string) {
    const record = await this.prisma.userSessionToken.findFirst({
      where: {
        userId,
        sessionId,
      },
      select: {
        token: true,
      },
    });
    return record?.token || null;
  }

  async findHostTokensInSession(sessionId: string) {
    return await this.prisma.userSessionToken.findMany({
      where: { sessionId, OR: [{ roleType: Roles.SUPER_HOST }, { roleType: Roles.SUB_HOST }] },
    });
  }

  async findTokenByToken(sessionId: string, token: string) {
    const record = await this.prisma.userSessionToken.findFirst({
      where: {
        token,
        sessionId,
        userId: null,
      },
      select: {
        token: true,
      },
    });
    return record?.token || null;
  }

  async findByToken(token: string) {
    return await this.prisma.userSessionToken.findFirst({
      where: {
        token,
      },
    });
  }

  async findByTokenWithPermissions(token: string) {
    return await this.prisma.userSessionToken.findFirst({
      where: {
        token,
      },
      include: {
        role: {
          include: {
            permissions: {},
          },
        },
      },
    });
  }

  async findTokenByUserIdAndToken(userId: number, sessionId: string, token: string) {
    const record = await this.prisma.userSessionToken.findFirst({
      where: {
        token,
        sessionId,
        userId,
      },
      select: {
        token: true,
      },
    });
    if (record === null) return await this.findTokenByUserId(userId, sessionId);
    return record?.token || null;
  }

  async findByIdAndSession(replyId: number, sessionId: string) {
    return await this.prisma.reply.findUnique({
      where: { replyId, sessionId },
    });
  }

  async findUsersBySessionId(sessionId: string) {
    return await this.prisma.userSessionToken.findMany({
      where: {
        sessionId,
        userId: {
          not: null,
        },
      },
      include: {
        user: {
          select: {
            userId: true,
            nickname: true,
          },
        },
      },
    });
  }

  async updateRoleType(token: string, roleType: keyof typeof Roles) {
    return await this.prisma.userSessionToken.update({
      where: {
        token,
      },
      data: { roleType },
      select: { user: true, roleType: true },
    });
  }
}
