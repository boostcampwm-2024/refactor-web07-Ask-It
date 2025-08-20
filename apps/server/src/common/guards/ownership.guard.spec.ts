import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { OwnershipGuard } from './ownership.guard';

describe('OwnershipGuard', () => {
  let guard: OwnershipGuard;
  let reflector: jest.Mocked<Reflector>;

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
        OwnershipGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<OwnershipGuard>(OwnershipGuard);
    reflector = module.get(Reflector);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('가드가 정의되어 있어야 한다', () => {
    expect(guard).toBeDefined();
  });

  it('소유권이 필요하지 않으면 true를 반환해야 한다', async () => {
    reflector.get.mockReturnValue(null);

    const result = await guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
  });

  it('잘못된 소유권 요청을 요청하면 ForbiddenException을 발생시켜야 한다', async () => {
    reflector.get.mockReturnValue('puhaha');
    const context = {
      ...mockExecutionContext,
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          body: { token: 'owner-token' },
          question: { createUserToken: 'owner-token' },
        }),
      }),
    };

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('토큰이 없으면 ForbiddenException을 발생시켜야 한다', async () => {
    reflector.get.mockReturnValue('question');
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
  });

  it('리소스 정보가 없으면 ForbiddenException을 발생시켜야 한다', async () => {
    reflector.get.mockReturnValue('question');
    const context = {
      ...mockExecutionContext,
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          body: { token: 'token' },
          query: {},
        }),
      }),
    };

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('소유자가 아니면 ForbiddenException을 발생시켜야 한다', async () => {
    reflector.get.mockReturnValue('question');
    const context = {
      ...mockExecutionContext,
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          body: { token: 'other-token' },
          question: { createUserToken: 'owner-token' },
        }),
      }),
    };

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('리소스 소유자면 true를 반환해야 한다', async () => {
    reflector.get.mockReturnValue('question');
    const context = {
      ...mockExecutionContext,
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          body: { token: 'owner-token' },
          question: { createUserToken: 'owner-token' },
        }),
      }),
    };

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });
});