import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { SessionsAuthRepository } from './sessions-auth.repository';
import { SessionsAuthService } from './sessions-auth.service';
import {
  MOCK_DATE,
  MOCK_FIND_USERS_BY_SESSION_ID_DATA,
  MOCK_SESSION_AUTH_DTO_WITH_TOKEN,
  MOCK_SESSION_AUTH_DTO_WITHOUT_TOKEN,
  MOCK_UPDATE_HOST_DTO_INVALID_TOKEN,
  MOCK_UPDATE_HOST_DTO_SELF_CHANGE,
  MOCK_UPDATE_HOST_DTO_SUPER_HOST,
  MOCK_UPDATE_HOST_DTO_SUPER_HOST_TOKEN_NOT_FOUND,
} from './test-sessions-auth-service.mock';

import { Permissions } from '@common/roles/permissions';
import { Roles } from '@common/roles/roles';
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
            /** 기존 코드에서 updateIsHost → 실제로는 updateRoleType 이므로 변경 */
            updateRoleType: jest.fn(),

            /** 서비스 코드에서 authorizeHost() 시 권한 확인에 사용 */
            findByTokenWithPermissions: jest.fn(),

            /** 아래 메서드는 테스트에서 직접 사용하지 않으면 mock 필요 X
             *  필요하다면 추가: findByToken, findHostTokensInSession 등
             */
            findByToken: jest.fn(),
            findHostTokensInSession: jest.fn(),
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

  // ------------------------------------------------------
  // 1) validateOrCreateToken (토큰 검증 혹은 생성)
  // ------------------------------------------------------
  describe('validateOrCreateToken', () => {
    it('토큰이 제공되지 않으면 새 토큰을 생성해야 한다.', async () => {
      sessionsAuthRepository.generateToken.mockResolvedValue('newToken');

      const result = await service.validateOrCreateToken(MOCK_SESSION_AUTH_DTO_WITHOUT_TOKEN, 1);

      expect(sessionsAuthRepository.generateToken).toHaveBeenCalledWith(1, '123');
      expect(result).toBe('newToken');
    });

    it('토큰이 제공되면 기존 토큰을 반환해야 한다.', async () => {
      // 기존 토큰이 존재한다고 가정
      sessionsAuthRepository.findTokenByUserIdAndToken.mockResolvedValue('existingToken');

      const result = await service.validateOrCreateToken(MOCK_SESSION_AUTH_DTO_WITH_TOKEN, 1);

      expect(sessionsAuthRepository.findTokenByUserIdAndToken).toHaveBeenCalledWith(1, '123', 'existingToken');
      expect(result).toBe('existingToken');
    });
  });

  // ------------------------------------------------------
  // 2) findUsers (사용자 목록 조회)
  // ------------------------------------------------------
  describe('findUsers', () => {
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

  // ------------------------------------------------------
  // 3) authorizeHost (호스트 권한 부여)
  // ------------------------------------------------------
  describe('authorizeHost', () => {
    it('새 호스트 권한을 부여해야 한다.', async () => {
      // 1) 권한 확인
      sessionsAuthRepository.findByTokenWithPermissions.mockResolvedValue({
        // 실제 코드에서 role.permissions.some(...) 확인
        role: {
          name: Roles.SUPER_HOST,
          permissions: [{ roleName: Roles.SUPER_HOST, permissionId: Permissions.GRANT_HOST }],
        },
        token: 'test-token',
        userId: 1,
        sessionId: 'test-session',
        roleType: Roles.SUPER_HOST,
      });
      // 2) 대상 userId → 토큰 조회
      sessionsAuthRepository.findTokenByUserId.mockResolvedValue('targetToken');
      // 3) 실제 업데이트
      sessionsAuthRepository.updateRoleType.mockResolvedValue({
        user: {
          userId: 2,
          nickname: 'User2',
          createdAt: MOCK_DATE,
          email: 'test@email.com',
          password: 'pw',
        },
        roleType: Roles.SUB_HOST, // isHost === true 인 상황
      });

      // authorizeHost 로직 실행
      const result = await service.authorizeHost(2, MOCK_UPDATE_HOST_DTO_SUPER_HOST);

      // 권한 체크
      expect(sessionsAuthRepository.findByTokenWithPermissions).toHaveBeenCalledWith('superHostToken');
      // 대상 토큰 조회
      expect(sessionsAuthRepository.findTokenByUserId).toHaveBeenCalledWith(2, '123');
      // 토큰 업데이트
      expect(sessionsAuthRepository.updateRoleType).toHaveBeenCalledWith('targetToken', Roles.SUB_HOST);

      // 결과 검증
      expect(result).toEqual({
        userId: 2,
        nickname: 'User2',
        isHost: true, // SUB_HOST이므로 true
      });
    });

    it('슈퍼 호스트가 아니라면 ForbiddenException을 발생시켜야 한다.', async () => {
      // 권한 목록에 GRANT_HOST가 없음
      sessionsAuthRepository.findByTokenWithPermissions.mockResolvedValue({
        role: {
          name: Roles.SUB_HOST,
          permissions: [],
        },
        token: 'test-token',
        userId: 1,
        sessionId: 'test-session',
        roleType: Roles.SUB_HOST,
      });

      await expect(service.authorizeHost(2, MOCK_UPDATE_HOST_DTO_INVALID_TOKEN)).rejects.toThrow(ForbiddenException);
    });

    it('타겟 토큰이 존재하지 않으면 NotFoundException을 발생시켜야 한다.', async () => {
      // 권한 있음
      sessionsAuthRepository.findByTokenWithPermissions.mockResolvedValue({
        role: {
          name: Roles.SUPER_HOST,
          permissions: [{ roleName: Roles.SUPER_HOST, permissionId: Permissions.GRANT_HOST }],
        },
        token: 'test-token',
        userId: 1,
        sessionId: 'test-session',
        roleType: Roles.SUPER_HOST,
      });
      // 대상 userId 에 대한 토큰이 없는 경우
      sessionsAuthRepository.findTokenByUserId.mockResolvedValue(null);

      await expect(service.authorizeHost(2, MOCK_UPDATE_HOST_DTO_SUPER_HOST_TOKEN_NOT_FOUND)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('본인의 호스트 권한을 변경하려 하면 BadRequestException을 발생시켜야 한다.', async () => {
      // 권한 있음
      sessionsAuthRepository.findByTokenWithPermissions.mockResolvedValue({
        role: {
          name: Roles.SUPER_HOST,
          permissions: [{ roleName: Roles.SUPER_HOST, permissionId: Permissions.GRANT_HOST }],
        },
        token: 'superHostToken',
        userId: 1,
        sessionId: 'test-session',
        roleType: Roles.SUPER_HOST,
      });
      // targetToken == 호출자의 token 인 상황 (자기 자신)
      sessionsAuthRepository.findTokenByUserId.mockResolvedValue('superHostToken');

      await expect(service.authorizeHost(1, MOCK_UPDATE_HOST_DTO_SELF_CHANGE)).rejects.toThrow(BadRequestException);
    });
  });
});
