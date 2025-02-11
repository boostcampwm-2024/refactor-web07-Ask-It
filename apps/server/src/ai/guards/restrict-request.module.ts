import { Module } from '@nestjs/common';

import { AiRequestValidationGuard } from './restrict-request.guard';

@Module({
  providers: [AiRequestValidationGuard],
  exports: [AiRequestValidationGuard],
})
export class AiRequestValidationModule {}
