import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ReplyOwnershipGuard } from './reply-ownership.guard';

describe('ReplyOwnershipGuard', () => {
  let guard: ReplyOwnershipGuard;

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        body: {},
        query: {},
      }),
    }),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReplyOwnershipGuard],
    }).compile();

    guard = module.get<ReplyOwnershipGuard>(ReplyOwnershipGuard);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('가드가 정의되어 있어야 한다', () => {
    expect(guard).toBeDefined();
  });

  it('답글 소유자가 맞으면 true를 반환해야 한다', async () => {
    const context = {
      ...mockExecutionContext,
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          body: { token: 'owner-token' },
          reply: { createUserToken: 'owner-token' },
        }),
      }),
    };

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('답글 소유자가 아니면 ForbiddenException을 발생시켜야 한다', async () => {
    const context = {
      ...mockExecutionContext,
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          body: { token: 'other-token' },
          reply: { createUserToken: 'owner-token' },
        }),
      }),
    };

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('query에서 토큰을 가져올 수 있어야 한다', async () => {
    const context = {
      ...mockExecutionContext,
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          body: {},
          query: { token: 'owner-token' },
          reply: { createUserToken: 'owner-token' },
        }),
      }),
    };

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
  });
});
