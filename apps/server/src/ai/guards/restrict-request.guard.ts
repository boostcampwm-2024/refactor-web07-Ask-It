import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AiRequestValidationGuard implements CanActivate {
  private readonly ttl = 3;

  constructor(
    @Inject('REDIS_RESTRICT_TOKEN') private readonly restrictTokenRedis: Redis,
    @Inject('REDIS_RESTRICT_IP') private readonly restrictIpRedis: Redis,
  ) {}
  async validateAiRequest(token: string, ip: string) {
    const [tokenExists, ipExists] = await Promise.all([
      this.restrictTokenRedis.get(token),
      this.restrictIpRedis.get(ip),
    ]);
    if (tokenExists || ipExists) {
      throw new ForbiddenException('저희의 토큰은 소중합니다.');
    }
    await Promise.all([
      this.restrictTokenRedis.set(token, 'true', 'EX', this.ttl),
      this.restrictIpRedis.set(ip, 'true', 'EX', this.ttl),
    ]);
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.body?.token || request.query?.token;

    const ip =
      request.headers['x-forwarded-for']?.toString().split(',')[0] || request.socket.remoteAddress || request.ip;

    await this.validateAiRequest(token, ip);
    return true;
  }
}
