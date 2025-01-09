import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateSessionDto } from './dto/create-session.dto';
import { SessionsRepository } from './sessions.repository';
import { SessionsService } from './sessions.service';
import {
  MOCK_BASE_DATE,
  MOCK_CREATED_SESSION,
  MOCK_SESSION,
  MOCK_SESSION_AUTH_HOST,
  MOCK_SESSION_AUTH_NON_HOST,
  MOCK_SESSIONS,
  MOCK_USER,
} from './test-sessions-service.mock';

import { Roles } from '@common/roles/roles';
import { SessionsAuthRepository } from '@sessions-auth/sessions-auth.repository';

describe('세션 서비스 (SessionsService)', () => {
  let service: SessionsService;
  let sessionRepository: jest.Mocked<SessionsRepository>;
  let sessionsAuthRepository: jest.Mocked<SessionsAuthRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: SessionsRepository,
          useValue: {
            create: jest.fn(),
            getSessionsById: jest.fn(),
            findById: jest.fn(),
            updateSessionExpiredAt: jest.fn(),
          },
        },
        {
          provide: SessionsAuthRepository,
          useValue: {
            generateToken: jest.fn(),
            findByToken: jest.fn(),
            findByTokenWithPermissions: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    sessionRepository = module.get(SessionsRepository);
    sessionsAuthRepository = module.get(SessionsAuthRepository);
  });

  it('서비스 인스턴스가 정의되어야 한다.', () => {
    expect(service).toBeDefined();
  });

  describe('create (세션 생성)', () => {
    it('세션을 생성하고 토큰을 발급해야 한다.', async () => {
      const data: CreateSessionDto = {
        title: MOCK_SESSION.title,
        sessionId: MOCK_SESSION.sessionId,
      };

      sessionRepository.create.mockResolvedValue(MOCK_CREATED_SESSION);
      sessionsAuthRepository.generateToken.mockResolvedValue(MOCK_SESSION_AUTH_HOST.token);

      const result = await service.create(data, MOCK_USER.userId);

      expect(sessionRepository.create).toHaveBeenCalledWith({
        ...data,
        expiredAt: expect.any(Date),
        user: { connect: { userId: MOCK_USER.userId } },
      });
      expect(sessionsAuthRepository.generateToken).toHaveBeenCalledWith(
        MOCK_USER.userId,
        MOCK_SESSION.sessionId,
        Roles.SUPER_HOST,
      );
      expect(result).toEqual({ sessionId: MOCK_SESSION.sessionId });
    });
  });

  describe('getSessionsById (세션 ID로 조회)', () => {
    it('세션 데이터를 변환하여 가져와야 한다.', async () => {
      sessionRepository.getSessionsById.mockResolvedValue(MOCK_SESSIONS);

      const result = await service.getSessionsById(MOCK_USER.userId);

      const formatDate = (date: Date) => ({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
      });

      expect(sessionRepository.getSessionsById).toHaveBeenCalledWith(MOCK_USER.userId);
      expect(result).toEqual([
        {
          sessionId: '123123',
          title: '테스트 세션',
          createdAt: formatDate(MOCK_BASE_DATE),
          expired: true,
        },
        {
          sessionId: MOCK_SESSION.sessionId,
          title: MOCK_SESSION.title,
          createdAt: formatDate(MOCK_BASE_DATE),
          expired: true,
        },
      ]);
    });
  });

  describe('terminateSession (세션 종료)', () => {
    it('호스트 사용자가 세션을 종료할 수 있어야 한다.', async () => {
      sessionsAuthRepository.findByTokenWithPermissions.mockResolvedValue(MOCK_SESSION_AUTH_HOST as any);

      const result = await service.terminateSession(MOCK_SESSION.sessionId, MOCK_SESSION_AUTH_HOST.token);

      expect(sessionsAuthRepository.findByTokenWithPermissions).toHaveBeenCalledWith(MOCK_SESSION_AUTH_HOST.token);
      expect(sessionRepository.updateSessionExpiredAt).toHaveBeenCalledWith(MOCK_SESSION.sessionId, expect.any(Date));
      expect(result).toEqual({ expired: true });
    });

    it('호스트가 아닌 사용자가 세션을 종료하려고 하면 ForbiddenException이 발생해야 한다.', async () => {
      sessionsAuthRepository.findByTokenWithPermissions.mockResolvedValue(MOCK_SESSION_AUTH_NON_HOST as any);

      await expect(service.terminateSession(MOCK_SESSION.sessionId, MOCK_SESSION_AUTH_NON_HOST.token)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
