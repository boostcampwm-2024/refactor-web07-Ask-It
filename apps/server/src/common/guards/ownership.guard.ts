import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { OWNERSHIP_KEY } from '@common/decorators/require-ownership.decorator';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireOwnership = this.reflector.get<boolean>(OWNERSHIP_KEY, context.getHandler());

    if (!requireOwnership) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.body?.token || request.query?.token;

    if (!token) {
      throw new ForbiddenException('사용자 토큰이 필요합니다.');
    }

    const resource = request.question || request.reply;

    if (!resource) {
      throw new ForbiddenException('리소스 정보를 찾을 수 없습니다.');
    }

    if (resource.createUserToken !== token) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    return true;
  }
}
