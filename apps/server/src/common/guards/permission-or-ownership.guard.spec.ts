import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { PermissionOrOwnershipGuard } from './permission-or-ownership.guard';

import { SessionsAuthRepository } from '@sessions-auth/sessions-auth.repository';

describe('PermissionOrOwnershipGuard', () => {
  let guard: PermissionOrOwnershipGuard;
  let reflector: jest.Mocked<Reflector>;
  let sessionAuthRepository: jest.Mocked<SessionsAuthRepository>;

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        body: {},
        query: {},
      }),
    }),
    getHandler: jest.fn(),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionOrOwnershipGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: SessionsAuthRepository,
          useValue: {
            findByTokenWithPermissions: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<PermissionOrOwnershipGuard>(PermissionOrOwnershipGuard);
    reflector = module.get(Reflector);
    sessionAuthRepository = module.get(SessionsAuthRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('가드가 정의되어 있어야 한다', () => {
    expect(guard).toBeDefined();
  });

  it('필요한 권한이 없으면 true를 반환해야 한다', async () => {
    reflector.get.mockReturnValue(null);

    const result = await guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
  });

  it('토큰이 없으면 ForbiddenException을 발생시켜야 한다', async () => {
    reflector.get.mockReturnValue(1);
    const context = {
      ...mockExecutionContext,
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          body: {},
          query: {},
        }),
      }),
    };

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    expect(sessionAuthRepository.findByTokenWithPermissions).not.toHaveBeenCalled();
  });

  it('필요한 권한이 있으면 true를 반환해야 한다', async () => {
    reflector.get.mockReturnValue(1);
    const context = {
      ...mockExecutionContext,
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          body: { token: 'valid-token' },
          query: {},
        }),
      }),
    };

    const mockUserWithPermission = {
      role: {
        permissions: [{ permissionId: 1 }],
      },
    };

    sessionAuthRepository.findByTokenWithPermissions.mockResolvedValue(mockUserWithPermission as any);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(sessionAuthRepository.findByTokenWithPermissions).toHaveBeenCalledWith('valid-token');
  });

  it('권한이 없어도 리소스 소유자면 true를 반환해야 한다', async () => {
    reflector.get.mockReturnValue(1);
    const context = {
      ...mockExecutionContext,
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          body: { token: 'owner-token' },
          query: {},
          reply: { createUserToken: 'owner-token' },
        }),
      }),
    };

    const mockUserWithoutPermission = {
      role: {
        permissions: [],
      },
    };

    sessionAuthRepository.findByTokenWithPermissions.mockResolvedValue(mockUserWithoutPermission as any);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(sessionAuthRepository.findByTokenWithPermissions).toHaveBeenCalledWith('owner-token');
  });

  it('권한도 없고 소유자도 아니면 ForbiddenException을 발생시켜야 한다', async () => {
    reflector.get.mockReturnValue(1);
    const context = {
      ...mockExecutionContext,
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          body: { token: 'other-token' },
          query: {},
          reply: { createUserToken: 'owner-token' },
        }),
      }),
    };

    const mockUserWithoutPermission = {
      role: {
        permissions: [],
      },
    };

    sessionAuthRepository.findByTokenWithPermissions.mockResolvedValue(mockUserWithoutPermission as any);

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
    expect(sessionAuthRepository.findByTokenWithPermissions).toHaveBeenCalledWith('other-token');
  });

  it('리소스 정보가 없으면 ForbiddenException을 발생시켜야 한다', async () => {
    reflector.get.mockReturnValue(1);
    const context = {
      ...mockExecutionContext,
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          body: { token: 'token' },
          query: {},
        }),
      }),
    };

    const mockUserWithoutPermission = {
      role: {
        permissions: [],
      },
    };

    sessionAuthRepository.findByTokenWithPermissions.mockResolvedValue(mockUserWithoutPermission as any);

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });
});
