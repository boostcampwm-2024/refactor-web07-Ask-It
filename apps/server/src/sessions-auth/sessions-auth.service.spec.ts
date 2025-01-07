import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { SessionsAuthRepository } from './sessions-auth.repository';
import { SessionsAuthService } from './sessions-auth.service';
import {
  MOCK_FIND_USERS_BY_SESSION_ID_DATA,
  MOCK_SESSION_AUTH_DTO_WITH_TOKEN,
  MOCK_SESSION_AUTH_DTO_WITHOUT_TOKEN,
  MOCK_UPDATE_HOST_DTO_INVALID_TOKEN,
  MOCK_UPDATE_HOST_DTO_SELF_CHANGE,
  MOCK_UPDATE_HOST_DTO_SUPER_HOST,
  MOCK_UPDATE_HOST_DTO_SUPER_HOST_TOKEN_NOT_FOUND,
} from './test-sessions-auth-service.mock';

import { SessionsRepository } from '@sessions/sessions.repository';

describe('SessionsAuthService', () => {
  let service: SessionsAuthService;
  let sessionsAuthRepository: jest.Mocked<SessionsAuthRepository>;
  let sessionsRepository: jest.Mocked<SessionsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsAuthService,
        {
          provide: SessionsAuthRepository,
          useValue: {
            generateToken: jest.fn(),
            findTokenByUserId: jest.fn(),
            findTokenByUserIdAndToken: jest.fn(),
            findTokenByToken: jest.fn(),
            findUsersBySessionId: jest.fn(),
            updateIsHost: jest.fn(),
            findByToken: jest.fn(),
          },
        },
        {
          provide: SessionsRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SessionsAuthService>(SessionsAuthService);
    sessionsAuthRepository = module.get(SessionsAuthRepository);
    sessionsRepository = module.get(SessionsRepository);
  });

  it('서비스가 정상적으로 정의되어야 한다.', () => {
    expect(service).toBeDefined();
  });

  describe('validateOrCreateToken (토큰 검증 혹은 생성)', () => {
    it('토큰이 제공되지 않으면 새 토큰을 생성해야 한다.', async () => {
      sessionsAuthRepository.generateToken.mockResolvedValue('newToken');

      const result = await service.validateOrCreateToken(MOCK_SESSION_AUTH_DTO_WITHOUT_TOKEN, 1);

      expect(sessionsAuthRepository.generateToken).toHaveBeenCalledWith(1, '123');
      expect(result).toBe('newToken');
    });

    it('토큰이 제공되면 기존 토큰을 반환해야 한다.', async () => {
      sessionsAuthRepository.findTokenByUserIdAndToken.mockResolvedValue('existingToken');

      const result = await service.validateOrCreateToken(MOCK_SESSION_AUTH_DTO_WITH_TOKEN, 1);

      expect(sessionsAuthRepository.findTokenByUserIdAndToken).toHaveBeenCalledWith(1, '123', 'existingToken');
      expect(result).toBe('existingToken');
    });
  });

  describe('findUsers (사용자 목록 조회)', () => {
    it('isHost 상태를 포함한 사용자 목록을 반환해야 한다.', async () => {
      sessionsAuthRepository.findUsersBySessionId.mockResolvedValue(MOCK_FIND_USERS_BY_SESSION_ID_DATA);

      const result = await service.findUsers('123');

      expect(sessionsAuthRepository.findUsersBySessionId).toHaveBeenCalledWith('123');
      expect(result).toEqual([
        { userId: 1, nickname: 'User1', isHost: true },
        { userId: 2, nickname: 'User2', isHost: false },
      ]);
    });
  });

  describe('authorizeHost (호스트 권한 부여)', () => {
    it('새 호스트 권한을 부여해야 한다.', async () => {
      sessionsAuthRepository.findTokenByUserId.mockResolvedValue('targetToken');
      sessionsAuthRepository.updateIsHost.mockResolvedValue({
        user: {
          userId: 2,
          createdAt: new Date(),
          email: 'user2@example.com',
          password: 'securePassword123',
          nickname: 'User2',
        },
        isHost: true,
      });
      jest.spyOn(service, 'validateSuperHost').mockResolvedValue(true);

      const result = await service.authorizeHost(2, MOCK_UPDATE_HOST_DTO_SUPER_HOST);

      expect(service.validateSuperHost).toHaveBeenCalledWith('123', 'superHostToken');
      expect(sessionsAuthRepository.updateIsHost).toHaveBeenCalledWith('targetToken', true);
      expect(result).toEqual({ userId: 2, nickname: 'User2', isHost: true });
    });

    it('슈퍼 호스트가 아니라면 ForbiddenException을 발생시켜야 한다.', async () => {
      jest.spyOn(service, 'validateSuperHost').mockResolvedValue(false);

      await expect(service.authorizeHost(2, MOCK_UPDATE_HOST_DTO_INVALID_TOKEN)).rejects.toThrow(ForbiddenException);
    });

    it('타겟 토큰이 존재하지 않으면 NotFoundException을 발생시켜야 한다.', async () => {
      sessionsAuthRepository.findTokenByUserId.mockResolvedValue(null);
      jest.spyOn(service, 'validateSuperHost').mockResolvedValue(true);

      await expect(service.authorizeHost(2, MOCK_UPDATE_HOST_DTO_SUPER_HOST_TOKEN_NOT_FOUND)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('본인의 호스트 권한을 변경하려 하면 BadRequestException을 발생시켜야 한다.', async () => {
      sessionsAuthRepository.findTokenByUserId.mockResolvedValue('targetToken');
      jest.spyOn(service, 'validateSuperHost').mockResolvedValue(true);

      await expect(service.authorizeHost(2, MOCK_UPDATE_HOST_DTO_SELF_CHANGE)).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateSuperHost (슈퍼 호스트 검증)', () => {
    it('세션 생성자이면 true를 반환해야 한다.', async () => {
      sessionsAuthRepository.findByToken.mockResolvedValue({
        sessionId: '123',
        token: 'token',
        userId: 1,
        isHost: true,
      });
      sessionsRepository.findById.mockResolvedValue({
        sessionId: '123',
        createUserId: 1,
        expiredAt: new Date(),
        createdAt: new Date(),
        title: 'asdasdsd',
      });

      const result = await service.validateSuperHost('123', 'token');
      expect(result).toBe(true);
    });

    it('세션 생성자가 아니면 false를 반환해야 한다.', async () => {
      sessionsRepository.findById.mockResolvedValue({
        sessionId: '123',
        title: 'Test Session',
        expiredAt: new Date(),
        createdAt: new Date(),
        createUserId: 1,
      });
      sessionsAuthRepository.findByToken.mockResolvedValue({
        token: 'token',
        userId: 2,
        sessionId: '123',
        isHost: false,
      });

      const result = await service.validateSuperHost('123', 'token');
      expect(result).toBe(false);
    });
  });
});
