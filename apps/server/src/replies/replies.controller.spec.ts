import { ForbiddenException, INestApplication, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { ReplyExistenceGuard } from './guards/reply-existence.guard';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';

import { OwnershipGuard } from '@common/guards/ownership.guard';
import { PermissionOrOwnershipGuard } from '@common/guards/permission-or-ownership.guard';
import { SessionTokenValidationGuard } from '@common/guards/session-token-validation.guard';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { QuestionExistenceGuard } from '@questions/guards/question-existence.guard';

// requestSocket 모킹
jest.mock('@common/request-socket', () => ({
  requestSocket: jest.fn(),
}));

describe('RepliesController 통합 테스트', () => {
  let app: INestApplication;
  let repliesService: jest.Mocked<RepliesService>;
  let sessionTokenValidationGuard: jest.Mocked<SessionTokenValidationGuard>;
  let questionExistenceGuard: jest.Mocked<QuestionExistenceGuard>;
  let replyExistenceGuard: jest.Mocked<ReplyExistenceGuard>;
  let ownershipGuard: jest.Mocked<OwnershipGuard>;
  let permissionOrOwnershipGuard: jest.Mocked<PermissionOrOwnershipGuard>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RepliesController],
      providers: [
        {
          provide: RepliesService,
          useValue: {
            createReply: jest.fn(),
            updateBody: jest.fn(),
            deleteReply: jest.fn(),
            toggleLike: jest.fn(),
            getLikesCount: jest.fn(),
            validateHost: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(SessionTokenValidationGuard)
      .useValue({
        canActivate: jest.fn(),
      })
      .overrideGuard(QuestionExistenceGuard)
      .useValue({
        canActivate: jest.fn(),
      })
      .overrideGuard(ReplyExistenceGuard)
      .useValue({
        canActivate: jest.fn(),
      })
      .overrideGuard(OwnershipGuard)
      .useValue({
        canActivate: jest.fn(),
      })
      .overrideGuard(PermissionOrOwnershipGuard)
      .useValue({
        canActivate: jest.fn(),
      })
      .overrideInterceptor(TransformInterceptor)
      .useValue({
        intercept: jest.fn((context, next) => next.handle()),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repliesService = moduleFixture.get(RepliesService);
    sessionTokenValidationGuard = moduleFixture.get(SessionTokenValidationGuard);
    questionExistenceGuard = moduleFixture.get(QuestionExistenceGuard);
    replyExistenceGuard = moduleFixture.get(ReplyExistenceGuard);
    ownershipGuard = moduleFixture.get(OwnershipGuard);
    permissionOrOwnershipGuard = moduleFixture.get(PermissionOrOwnershipGuard);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /replies (답글 생성)', () => {
    const createReplyDto = {
      body: 'Test reply',
      questionId: 1,
      token: 'valid-token',
      sessionId: 'session123',
    };

    it('유효한 데이터로 답글 생성 성공', async () => {
      const mockCreatedAt = new Date('2025-07-18T12:29:53.875Z');
      const mockReply = {
        replyId: 1,
        body: 'Test reply',
        createdAt: mockCreatedAt,
        isOwner: true,
        likesCount: 0,
        liked: false,
        deleted: false,
        questionId: 1,
        nickname: 'TestUser',
        userId: 1,
      };

      // 가드들이 모두 통과하도록 설정
      sessionTokenValidationGuard.canActivate.mockResolvedValue(true);
      questionExistenceGuard.canActivate.mockResolvedValue(true);

      repliesService.createReply.mockResolvedValue(mockReply);
      repliesService.validateHost.mockResolvedValue(true);

      const response = await request(app.getHttpServer()).post('/replies').send(createReplyDto).expect(201);

      // Date 직렬화 문제 해결: 날짜를 문자열로 변환하여 비교
      const expectedReply = { ...mockReply, isHost: true, createdAt: mockCreatedAt.toISOString() };
      expect(response.body.reply).toEqual(expectedReply);
      expect(repliesService.createReply).toHaveBeenCalledWith(createReplyDto);
      expect(repliesService.validateHost).toHaveBeenCalledWith('valid-token');
    });

    it('토큰 검증 실패 시 403 에러', async () => {
      sessionTokenValidationGuard.canActivate.mockRejectedValue(new ForbiddenException('토큰이 유효하지 않습니다'));

      await request(app.getHttpServer()).post('/replies').send(createReplyDto).expect(403);

      expect(repliesService.createReply).not.toHaveBeenCalled();
    });

    it('질문이 존재하지 않으면 404 에러', async () => {
      sessionTokenValidationGuard.canActivate.mockResolvedValue(true);
      questionExistenceGuard.canActivate.mockRejectedValue(new NotFoundException('질문이 존재하지 않습니다'));

      await request(app.getHttpServer()).post('/replies').send(createReplyDto).expect(404);

      expect(repliesService.createReply).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /replies/:replyId/body (답글 수정)', () => {
    const updateReplyDto = {
      body: 'Updated reply',
      token: 'owner-token',
      sessionId: 'session123',
    };

    it('소유자가 답글 수정 성공', async () => {
      const mockCreatedAt = new Date('2025-07-18T12:29:53.924Z');
      const mockUpdatedReply = {
        replyId: 1,
        body: 'Updated reply',
        createUserToken: 'owner-token',
        sessionId: 'session123',
        questionId: 1,
        createdAt: mockCreatedAt,
        deleted: false,
      };

      // 가드들이 모두 통과하도록 설정
      sessionTokenValidationGuard.canActivate.mockResolvedValue(true);
      replyExistenceGuard.canActivate.mockResolvedValue(true);
      ownershipGuard.canActivate.mockResolvedValue(true);

      repliesService.updateBody.mockResolvedValue(mockUpdatedReply);

      const response = await request(app.getHttpServer()).patch('/replies/1/body').send(updateReplyDto).expect(200);

      // Date 직렬화 문제 해결: 날짜를 문자열로 변환하여 비교
      const expectedReply = { ...mockUpdatedReply, createdAt: mockCreatedAt.toISOString() };
      expect(response.body.reply).toEqual(expectedReply);
      expect(repliesService.updateBody).toHaveBeenCalledWith(1, updateReplyDto);
    });

    it('답글이 존재하지 않으면 404 에러', async () => {
      sessionTokenValidationGuard.canActivate.mockResolvedValue(true);
      replyExistenceGuard.canActivate.mockRejectedValue(new NotFoundException('답글이 존재하지 않습니다'));

      await request(app.getHttpServer()).patch('/replies/999/body').send(updateReplyDto).expect(404);

      expect(repliesService.updateBody).not.toHaveBeenCalled();
    });

    it('답글 소유자가 아니면 403 에러', async () => {
      sessionTokenValidationGuard.canActivate.mockResolvedValue(true);
      replyExistenceGuard.canActivate.mockResolvedValue(true);
      ownershipGuard.canActivate.mockRejectedValue(new ForbiddenException('권한이 없습니다.'));

      await request(app.getHttpServer())
        .patch('/replies/1/body')
        .send({ ...updateReplyDto, token: 'other-token' })
        .expect(403);

      expect(repliesService.updateBody).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /replies/:replyId (답글 삭제)', () => {
    it('권한이 있는 사용자가 답글 삭제 성공', async () => {
      const mockDeletedReply = {
        replyId: 1,
        createUserToken: 'owner-token',
        sessionId: 'session123',
        questionId: 1,
        body: 'Test reply',
        createdAt: new Date(),
        deleted: true,
      };

      // 가드들이 모두 통과하도록 설정
      sessionTokenValidationGuard.canActivate.mockResolvedValue(true);
      replyExistenceGuard.canActivate.mockResolvedValue(true);
      permissionOrOwnershipGuard.canActivate.mockResolvedValue(true);

      repliesService.deleteReply.mockResolvedValue(mockDeletedReply);

      await request(app.getHttpServer())
        .delete('/replies/1')
        .query({ token: 'admin-token', sessionId: 'session123' })
        .expect(200);

      expect(repliesService.deleteReply).toHaveBeenCalledWith(1);
    });

    it('권한이 없는 사용자는 답글 삭제 실패', async () => {
      sessionTokenValidationGuard.canActivate.mockResolvedValue(true);
      replyExistenceGuard.canActivate.mockResolvedValue(true);
      permissionOrOwnershipGuard.canActivate.mockRejectedValue(new ForbiddenException('권한이 없습니다'));

      await request(app.getHttpServer())
        .delete('/replies/1')
        .query({ token: 'user-token', sessionId: 'session123' })
        .expect(403);

      expect(repliesService.deleteReply).not.toHaveBeenCalled();
    });

    it('답글이 존재하지 않으면 404 에러', async () => {
      sessionTokenValidationGuard.canActivate.mockResolvedValue(true);
      replyExistenceGuard.canActivate.mockRejectedValue(new NotFoundException('답글이 존재하지 않습니다'));

      await request(app.getHttpServer())
        .delete('/replies/999')
        .query({ token: 'admin-token', sessionId: 'session123' })
        .expect(404);

      expect(repliesService.deleteReply).not.toHaveBeenCalled();
    });
  });

  describe('POST /replies/:replyId/likes (답글 좋아요)', () => {
    it('답글 좋아요 토글 성공', async () => {
      const mockToggleResult = { liked: true, questionId: 1 };
      const mockLikesCount = 5;

      sessionTokenValidationGuard.canActivate.mockResolvedValue(true);
      repliesService.toggleLike.mockResolvedValue(mockToggleResult);
      repliesService.getLikesCount.mockResolvedValue(mockLikesCount);

      const response = await request(app.getHttpServer())
        .post('/replies/1/likes')
        .send({ token: 'user-token', sessionId: 'session123' })
        .expect(201);

      expect(response.body).toEqual({
        liked: true,
        likesCount: 5,
      });
      expect(repliesService.toggleLike).toHaveBeenCalledWith(1, 'user-token');
      expect(repliesService.getLikesCount).toHaveBeenCalledWith(1);
    });

    it('토큰 검증 실패 시 403 에러', async () => {
      sessionTokenValidationGuard.canActivate.mockRejectedValue(new ForbiddenException('토큰이 유효하지 않습니다'));

      await request(app.getHttpServer())
        .post('/replies/1/likes')
        .send({ token: 'invalid-token', sessionId: 'session123' })
        .expect(403);

      expect(repliesService.toggleLike).not.toHaveBeenCalled();
    });
  });
});
