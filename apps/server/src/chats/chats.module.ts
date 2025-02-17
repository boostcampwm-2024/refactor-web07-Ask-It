import { Module } from '@nestjs/common';

import { ChatsController } from './chats.controller';
import { ChatsRepository } from './chats.repository';
import { ChatsService } from './chats.service';

import { LoggerModule } from '@logger/logger.module';
import { PrismaModule } from '@prisma-alias/prisma.module';

@Module({
  imports: [PrismaModule, LoggerModule],
  providers: [ChatsRepository, ChatsService],
  exports: [ChatsService, ChatsRepository],
  controllers: [ChatsController],
})
export class ChatsModule {}
