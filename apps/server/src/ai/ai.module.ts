import { Module } from '@nestjs/common';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';

import { SessionTokenModule } from '@common/guards/session-token.module';
import { PrismaModule } from '@prisma-alias/prisma.module';

@Module({
  imports: [PrismaModule, SessionTokenModule],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
