import { Module } from '@nestjs/common';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';

import { SessionTokenModule } from '@common/guards/session-token.module';

@Module({
  imports: [SessionTokenModule],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
