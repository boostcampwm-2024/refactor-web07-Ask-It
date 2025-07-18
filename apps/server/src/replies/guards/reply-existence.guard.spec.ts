import { ExecutionContext, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ReplyExistenceGuard } from './reply-existence.guard';

import { RepliesRepository } from '@replies/replies.repository';

describe('ReplyExistenceGuard', () => {
  let guard: ReplyExistenceGuard;
  let repliesRepository: jest.Mocked<RepliesRepository>;

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        params: { replyId: '1' },
        body: { sessionId: 'session123' },
        query: {},
      }),
    }),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReplyExistenceGuard,
        {
          provide: RepliesRepository,
          useValue: {
            findReplyByIdAndSessionId: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<ReplyExistenceGuard>(ReplyExistenceGuard);
    repliesRepository = module.get(RepliesRepository);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('가드가 정의되어 있어야 한다', () => {
    expect(guard).toBeDefined();
  });

  it('답글이 존재하면 true를 반환하고 request에 답글 정보를 추가해야 한다', async () => {
    const mockReply = {
      replyId: 1,
      body: 'Test reply',
      createUserToken: 'token',
      sessionId: 'session123',
      questionId: 1,
      createdAt: new Date(),
      deleted: false,
    };

    const mockRequest: any = {
      params: { replyId: '1' },
      body: { sessionId: 'session123' },
      query: {},
    };

    const mockGetRequest = jest.fn().mockReturnValue(mockRequest);
    const context = {
      ...mockExecutionContext,
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: mockGetRequest,
      }),
    };

    repliesRepository.findReplyByIdAndSessionId.mockResolvedValue(mockReply);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(repliesRepository.findReplyByIdAndSessionId).toHaveBeenCalledWith(1, 'session123');
    expect(mockRequest.reply).toEqual(mockReply);
  });

  it('답글이 존재하지 않으면 NotFoundException을 발생시켜야 한다', async () => {
    const context = {
      ...mockExecutionContext,
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          params: { replyId: '999' },
          body: { sessionId: 'session123' },
          query: {},
        }),
      }),
    };

    repliesRepository.findReplyByIdAndSessionId.mockResolvedValue(null);

    await expect(guard.canActivate(context)).rejects.toThrow(NotFoundException);
    expect(repliesRepository.findReplyByIdAndSessionId).toHaveBeenCalledWith(999, 'session123');
  });

  it('query에서 sessionId를 가져올 수 있어야 한다', async () => {
    const mockReply = {
      replyId: 1,
      body: 'Test reply',
      createUserToken: 'token',
      sessionId: 'session123',
      questionId: 1,
      createdAt: new Date(),
      deleted: false,
    };

    const mockRequest: any = {
      params: { replyId: '1' },
      body: {},
      query: { sessionId: 'session123' },
    };

    const context = {
      ...mockExecutionContext,
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };

    repliesRepository.findReplyByIdAndSessionId.mockResolvedValue(mockReply);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(repliesRepository.findReplyByIdAndSessionId).toHaveBeenCalledWith(1, 'session123');
    expect(mockRequest.reply).toEqual(mockReply);
  });
});
