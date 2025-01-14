import { Injectable } from '@nestjs/common';

import { PrismaService } from '@prisma-alias/prisma.service';

@Injectable()
export class SessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(sessionId: string) {
    return await this.prisma.session.findUnique({
      where: { sessionId },
    });
  }
}
