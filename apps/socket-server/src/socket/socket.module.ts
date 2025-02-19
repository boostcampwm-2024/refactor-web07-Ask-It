import { ChatsModule } from '@chats/chats.module';
import { SessionTokenValidationGuard } from '@common/guards/session-token-validation.guard';
import { SessionTokenModule } from '@common/guards/session-token.module';
import { LoggerModule } from '@logger/logger.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma-alias/prisma.module';

import { SocketController } from './socket.controller';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [PrismaModule, ChatsModule, SessionTokenModule, LoggerModule],
  providers: [SocketGateway, SessionTokenValidationGuard],
  exports: [SocketGateway],
  controllers: [SocketController],
})
export class SocketModule {}
