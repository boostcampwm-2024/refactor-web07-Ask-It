import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSION_KEY } from '@common/decorators/require-permission.decorator';
import { SessionsAuthRepository } from '@sessions-auth/sessions-auth.repository';

@Injectable()
export class PermissionOrOwnershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly sessionAuthRepository: SessionsAuthRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<number>(PERMISSION_KEY, context.getHandler());

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.body?.token || request.query?.token;

    if (!token) {
      throw new ForbiddenException('사용자 토큰이 필요합니다.');
    }

    try {
      const { role } = await this.sessionAuthRepository.findByTokenWithPermissions(token);
      const hasPermission = role.permissions.some(({ permissionId }) => permissionId === requiredPermission);

      if (hasPermission) {
        return true;
      }

      const resource = request.question || request.reply;

      if (!resource) {
        throw new ForbiddenException('리소스 정보를 찾을 수 없습니다.');
      }

      if (resource.createUserToken !== token) {
        throw new ForbiddenException('권한이 없습니다.');
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('권한 확인 중 오류가 발생했습니다.');
    }
  }
}
