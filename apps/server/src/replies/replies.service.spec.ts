import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Reply } from '@prisma/client';

import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyBodyDto } from './dto/update-reply.dto';
import { RepliesRepository } from './replies.repository';
import { RepliesService } from './replies.service';
import {
  MOCK_CREATED_REPLY,
  MOCK_DATE,
  MOCK_REPLY_LIKE,
  MOCK_REPLY_WITH_ENTITY,
  MOCK_SESSION_AUTH_NO_PERM,
  MOCK_SESSION_AUTH_OTHER,
  MOCK_SESSION_AUTH_OWNER,
  MOCK_SESSION_AUTH_WITH_DELETE,
  MOCK_UPDATED_REPLY,
} from './test-replies-service.mock';

import { SessionsRepository } from '@sessions/sessions.repository';
import { SessionsAuthRepository } from '@sessions-auth/sessions-auth.repository';

describe('RepliesService', () => {
  let service: RepliesService;
  let repliesRepository: jest.Mocked<RepliesRepository>;
  let sessionAuthRepository: jest.Mocked<SessionsAuthRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepliesService,
        {
          provide: RepliesRepository,
          useValue: {
            createReply: jest.fn(),
            updateBody: jest.fn(),
            deleteReply: jest.fn(),
            findLike: jest.fn(),
            createLike: jest.fn(),
            deleteLike: jest.fn(),
            getLikesCount: jest.fn(),
          },
        },
        {
          provide: SessionsRepository,
          useValue: {
            findById: jest.fn(),
            findBySessionIdAndToken: jest.fn(),
          },
        },
        {
          provide: SessionsAuthRepository,
          useValue: {
            findByToken: jest.fn(),
            findByTokenWithPermissions: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RepliesService>(RepliesService);
    repliesRepository = module.get(RepliesRepository);
    sessionAuthRepository = module.get(SessionsAuthRepository);
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('createReply', () => {
    it('새로운 답글을 생성하고 형식화된 데이터를 반환해야 한다', async () => {
      const createReplyDto: CreateReplyDto = {
        body: 'Test reply',
        questionId: 1,
        token: 'token',
        sessionId: '123',
      };

      repliesRepository.createReply.mockResolvedValue(MOCK_REPLY_WITH_ENTITY);

      const result = await service.createReply(createReplyDto);

      expect(repliesRepository.createReply).toHaveBeenCalledWith(createReplyDto);
      expect(result).toEqual({
        userId: 1,
        replyId: 1,
        body: 'Test reply',
        createdAt: MOCK_DATE,
        isOwner: true,
        likesCount: 0,
        liked: false,
        deleted: false,
        questionId: 1,
        nickname: 'TestUser',
      });
    });
  });

  describe('updateBody', () => {
    it('답글 내용을 수정해야 한다', async () => {
      const replyId = 1;
      const updateReplyBodyDto: UpdateReplyBodyDto = {
        body: 'Updated reply',
        token: 'token',
        sessionId: 'test-session',
      };

      repliesRepository.updateBody.mockResolvedValue(MOCK_UPDATED_REPLY);

      const result = await service.updateBody(replyId, updateReplyBodyDto);

      expect(repliesRepository.updateBody).toHaveBeenCalledWith(replyId, 'Updated reply');
      expect(result).toEqual(MOCK_UPDATED_REPLY);
    });
  });

  describe('deleteReply', () => {
    const replyId = 1;
    const sampleReply: Reply = {
      replyId,
      body: 'Test Body',
      createUserToken: 'ownerToken',
      createdAt: new Date(),
      deleted: false,
      questionId: 1,
      sessionId: '123',
    };

    it('DELETE_REPLY 권한이 있으면 삭제 가능', async () => {
      sessionAuthRepository.findByTokenWithPermissions.mockResolvedValue(MOCK_SESSION_AUTH_WITH_DELETE as any);
      repliesRepository.deleteReply.mockResolvedValue(undefined);

      await service.deleteReply(replyId, 'hasDeleteToken', sampleReply);

      expect(sessionAuthRepository.findByTokenWithPermissions).toHaveBeenCalledWith('hasDeleteToken');
      expect(repliesRepository.deleteReply).toHaveBeenCalledWith(replyId);
    });

    it('권한 없어도 소유자 토큰이면 삭제 가능', async () => {
      sessionAuthRepository.findByTokenWithPermissions.mockResolvedValue(MOCK_SESSION_AUTH_OWNER as any);
      repliesRepository.deleteReply.mockResolvedValue(undefined);

      await service.deleteReply(replyId, 'token', {
        ...sampleReply,
        createUserToken: 'token',
      });

      expect(sessionAuthRepository.findByTokenWithPermissions).toHaveBeenCalledWith('token');
      expect(repliesRepository.deleteReply).toHaveBeenCalledWith(replyId);
    });

    it('권한도 없고 소유자도 아니면 ForbiddenException', async () => {
      sessionAuthRepository.findByTokenWithPermissions.mockResolvedValue(MOCK_SESSION_AUTH_NO_PERM as any);

      await expect(service.deleteReply(replyId, 'noPermToken', sampleReply)).rejects.toThrow(ForbiddenException);

      expect(sessionAuthRepository.findByTokenWithPermissions).toHaveBeenCalledWith('noPermToken');
      expect(repliesRepository.deleteReply).not.toHaveBeenCalled();
    });
  });

  describe('toggleLike', () => {
    it('좋아요가 없으면 새로 만들고 liked: true 반환', async () => {
      const replyId = 1;
      const createUserToken = 'token';
      repliesRepository.findLike.mockResolvedValue(null);
      repliesRepository.createLike.mockResolvedValue(MOCK_REPLY_LIKE);

      const result = await service.toggleLike(replyId, createUserToken);

      expect(repliesRepository.findLike).toHaveBeenCalledWith(replyId, createUserToken);
      expect(repliesRepository.createLike).toHaveBeenCalledWith(replyId, createUserToken);
      expect(result).toEqual({ liked: true, questionId: 1 });
    });

    it('이미 좋아요가 있으면 제거하고 liked: false 반환', async () => {
      const replyId = 1;
      const createUserToken = 'token';
      repliesRepository.findLike.mockResolvedValue({
        replyLikeId: 1,
        replyId,
        createUserToken,
      });
      repliesRepository.deleteLike.mockResolvedValue(MOCK_REPLY_LIKE);

      const result = await service.toggleLike(replyId, createUserToken);

      expect(repliesRepository.findLike).toHaveBeenCalledWith(replyId, createUserToken);
      expect(repliesRepository.deleteLike).toHaveBeenCalledWith(1);
      expect(result).toEqual({ liked: false, questionId: 1 });
    });
  });

  describe('getLikesCount', () => {
    it('답글 좋아요 수를 반환', async () => {
      const replyId = 1;
      repliesRepository.getLikesCount.mockResolvedValue(10);

      const result = await service.getLikesCount(replyId);

      expect(repliesRepository.getLikesCount).toHaveBeenCalledWith(replyId);
      expect(result).toBe(10);
    });
  });
});
