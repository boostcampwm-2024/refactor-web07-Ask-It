import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AiRequestValidationGuard implements CanActivate {
  private readonly ttl = 3;

  constructor(@Inject('REDIS_RESTRICT_TOKEN') private readonly restrictRedisClient: Redis) {}

  async validateAiRequest(token: string) {
    const exists = await this.restrictRedisClient.get(token);
    if (Number(exists) === 1) {
      throw new ForbiddenException('저희의 토큰은 소중합니다.');
    }
    await this.restrictRedisClient.set(token, 1, 'EX', this.ttl);
  }
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.body?.token || request.query?.token;

    await this.validateAiRequest(token);
    return true;
  }
}
