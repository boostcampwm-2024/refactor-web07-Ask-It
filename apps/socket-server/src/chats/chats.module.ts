import { LoggerModule } from '@logger/logger.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma-alias/prisma.module';

import { ChatEvents } from './chat.event';
import { ChatsController } from './chats.controller';
import { ChatsRepository } from './chats.repository';
import { ChatsService } from './chats.service';

@Module({
  imports: [PrismaModule, LoggerModule],
  providers: [ChatsRepository, ChatsService, ChatEvents],
  exports: [ChatsService, ChatsRepository],
  controllers: [ChatsController],
})
export class ChatsModule {}
