import { Injectable } from '@nestjs/common';

import { PrismaService } from '@prisma-alias/prisma.service';

@Injectable()
export class SessionsAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByToken(token: string) {
    return await this.prisma.userSessionToken.findFirst({
      where: {
        token,
      },
    });
  }
}
