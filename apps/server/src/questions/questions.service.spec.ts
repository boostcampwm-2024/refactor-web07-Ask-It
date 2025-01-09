import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { QuestionsRepository } from './questions.repository';
import { QuestionsService } from './questions.service';
import {
  MOCK_CREATED_QUESTION,
  MOCK_DATE,
  MOCK_HOST_TOKENS,
  MOCK_QUESTION,
  MOCK_SESSION,
  MOCK_SESSION_AUTH_HOST,
  MOCK_SESSION_AUTH_NON_HOST,
} from './test-questions-service.mock';

import { RepliesRepository } from '@replies/replies.repository';
import { SessionsRepository } from '@sessions/sessions.repository';
import { SessionsAuthRepository } from '@sessions-auth/sessions-auth.repository';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let questionsRepository: jest.Mocked<QuestionsRepository>;
  let sessionsRepository: jest.Mocked<SessionsRepository>;
  let sessionsAuthRepository: jest.Mocked<SessionsAuthRepository>;
  let repliesRepository: jest.Mocked<RepliesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: QuestionsRepository,
          useValue: {
            create: jest.fn(),
            findQuestionsWithDetails: jest.fn(),
            findLike: jest.fn(),
            createLike: jest.fn(),
            deleteLike: jest.fn(),
            getLikesCount: jest.fn(),
            updateBody: jest.fn(),
            deleteQuestion: jest.fn(),
            updatePinned: jest.fn(),
            updateClosed: jest.fn(),
          },
        },
        {
          provide: SessionsRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: SessionsAuthRepository,
          useValue: {
            findHostTokensInSession: jest.fn(),
            findByTokenWithPermissions: jest.fn(),
          },
        },
        {
          provide: RepliesRepository,
          useValue: {
            findReplyByQuestionId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    questionsRepository = module.get(QuestionsRepository);
    sessionsRepository = module.get(SessionsRepository);
    sessionsAuthRepository = module.get(SessionsAuthRepository);
    repliesRepository = module.get(RepliesRepository);
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('createQuestion', () => {
    it('질문을 생성하고 포맷된 결과를 반환해야 한다', async () => {
      const createQuestionDto = {
        sessionId: 'test-session',
        token: 'test-token',
        body: 'Test question',
      };
      questionsRepository.create.mockResolvedValue(MOCK_CREATED_QUESTION);

      const result = await service.createQuestion(createQuestionDto);

      expect(questionsRepository.create).toHaveBeenCalledWith(createQuestionDto);
      expect(result).toEqual({
        questionId: 1,
        createUserToken: 'test-token',
        sessionId: 'test-session',
        body: 'Test question',
        closed: false,
        pinned: false,
        createdAt: MOCK_DATE,
        isOwner: true,
        likesCount: 0,
        liked: false,
        nickname: 'TestUser',
        replies: [],
      });
    });
  });

  describe('getQuestionsBySession', () => {
    it('질문 목록을 정상적으로 반환해야 한다', async () => {
      const mockData = {
        sessionId: 'test-session',
        token: 'test-token',
      };

      questionsRepository.findQuestionsWithDetails.mockResolvedValue([MOCK_QUESTION]);
      sessionsRepository.findById.mockResolvedValue(MOCK_SESSION);
      sessionsAuthRepository.findHostTokensInSession.mockResolvedValue(MOCK_HOST_TOKENS);

      const [questions, isHost, expired, title] = await service.getQuestionsBySession(mockData);

      const question = questions[0];
      expect(question.questionId).toBe(MOCK_QUESTION.questionId);
      expect(question.sessionId).toBe(MOCK_QUESTION.sessionId);
      expect(question.body).toBe(MOCK_QUESTION.body);
      expect(question.createdAt).toBe(MOCK_DATE);
      expect(question.isOwner).toBe(true);
      expect(question.likesCount).toBe(1);
      expect(question.liked).toBe(false);
      expect(question.nickname).toBe('TestUser');

      const reply = question.replies[0];
      expect(reply.replyId).toBe(MOCK_QUESTION.replies[0].replyId);
      expect(reply.body).toBe(MOCK_QUESTION.replies[0].body);
      expect(reply.isOwner).toBe(false);
      expect(reply.likesCount).toBe(1);
      expect(reply.liked).toBe(false);
      expect(reply.nickname).toBe('ReplyUser');

      expect(isHost).toBeFalsy();
      expect(expired).toBeTruthy();
      expect(title).toBe('Test Session');
    });
  });

  describe('updateQuestionBody', () => {
    const mockQuestion = {
      ...MOCK_QUESTION,
      replies: [],
    };

    it('질문에 답변이 없을 때 본문을 수정할 수 있어야 한다', async () => {
      const updateDto = { body: 'Updated body', sessionId: 'test-session', token: 'test-token' };

      repliesRepository.findReplyByQuestionId.mockResolvedValue(null);
      questionsRepository.updateBody.mockResolvedValue({ ...mockQuestion, body: updateDto.body });

      await service.updateQuestionBody(1, updateDto, mockQuestion);

      expect(questionsRepository.updateBody).toHaveBeenCalledWith(1, updateDto.body);
    });

    it('질문에 답변이 존재하면 ForbiddenException을 발생시켜야 한다', async () => {
      const updateDto = { body: 'Updated body', sessionId: 'test-session', token: 'test-token' };

      repliesRepository.findReplyByQuestionId.mockResolvedValue(true);

      await expect(service.updateQuestionBody(1, updateDto, mockQuestion)).rejects.toThrow(ForbiddenException);
    });

    it('질문이 이미 닫혀 있으면 ForbiddenException을 발생시켜야 한다', async () => {
      const updateDto = { body: 'Updated body', sessionId: 'test-session', token: 'test-token' };
      const closedQuestion = { ...mockQuestion, closed: true };

      await expect(service.updateQuestionBody(1, updateDto, closedQuestion)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteQuestion', () => {
    const mockQuestion = { ...MOCK_QUESTION };

    it('호스트 사용자가 질문을 삭제할 수 있어야 한다', async () => {
      sessionsAuthRepository.findByTokenWithPermissions.mockResolvedValue(MOCK_SESSION_AUTH_HOST);
      questionsRepository.deleteQuestion.mockResolvedValue(mockQuestion);

      await service.deleteQuestion(1, mockQuestion, { token: 'host-token', sessionId: 'test-session' });
      expect(sessionsAuthRepository.findByTokenWithPermissions).toHaveBeenCalledWith('host-token');
      expect(questionsRepository.deleteQuestion).toHaveBeenCalledWith(1);
    });

    it('호스트가 아닌 사용자가 질문을 삭제하려고 하면 ForbiddenException을 발생시켜야 한다', async () => {
      sessionsAuthRepository.findByTokenWithPermissions.mockResolvedValue(MOCK_SESSION_AUTH_NON_HOST);

      await expect(
        service.deleteQuestion(1, mockQuestion, { token: 'wrong-token', sessionId: 'test-session' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('toggleLike', () => {
    it('좋아요가 없을 경우 생성하고 liked: true를 반환해야 한다', async () => {
      questionsRepository.findLike.mockResolvedValue(null);

      const result = await service.toggleLike(1, 'test-token');

      expect(questionsRepository.createLike).toHaveBeenCalledWith(1, 'test-token');
      expect(result).toEqual({ liked: true });
    });

    it('이미 좋아요가 있을 경우 삭제하고 liked: false를 반환해야 한다', async () => {
      questionsRepository.findLike.mockResolvedValue({
        questionLikeId: 1,
        createUserToken: 'test-token',
        questionId: 1,
      });

      const result = await service.toggleLike(1, 'test-token');

      expect(questionsRepository.deleteLike).toHaveBeenCalledWith(1);
      expect(result).toEqual({ liked: false });
    });
  });

  describe('updateQuestionPinned', () => {
    it('호스트 사용자가 질문을 고정할 수 있어야 한다', async () => {
      const updateDto = { token: 'host-token', sessionId: 'test-session', pinned: true };

      sessionsAuthRepository.findByTokenWithPermissions.mockResolvedValue(MOCK_SESSION_AUTH_HOST);
      questionsRepository.updatePinned.mockResolvedValue({
        questionId: 1,
        pinned: true,
        createUserToken: 'test-token',
        sessionId: 'test-session',
        body: 'test-body',
        closed: false,
        createdAt: MOCK_DATE,
      });

      await service.updateQuestionPinned(1, updateDto);

      expect(sessionsAuthRepository.findByTokenWithPermissions).toHaveBeenCalledWith(updateDto.token);
      expect(questionsRepository.updatePinned).toHaveBeenCalledWith(1, true);
    });

    it('호스트가 아닌 사용자가 고정 상태를 변경하려 하면 ForbiddenException을 발생시켜야 한다', async () => {
      const updateDto = { token: 'non-host-token', sessionId: 'test-session', pinned: true };

      sessionsAuthRepository.findByTokenWithPermissions.mockResolvedValue(MOCK_SESSION_AUTH_NON_HOST);

      await expect(service.updateQuestionPinned(1, updateDto)).rejects.toThrow(ForbiddenException);
    });
  });
});
