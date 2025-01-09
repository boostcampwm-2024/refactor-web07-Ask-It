// test-sessions-auth-service.mock.ts

import { Roles } from '@common/roles/roles';

export const MOCK_DATE = new Date('2025-01-01T00:00:00.000Z');

/**
 * 토큰이 없는 경우 (서비스 코드에서 if (!token) 로 처리)
 */
export const MOCK_SESSION_AUTH_DTO_WITHOUT_TOKEN = {
  sessionId: '123',
  token: null,
};

/**
 * 토큰이 존재하는 경우
 */
export const MOCK_SESSION_AUTH_DTO_WITH_TOKEN = {
  sessionId: '123',
  token: 'existingToken',
};

/**
 * findUsersBySessionId 에서 반환되는 예시 데이터
 * user, roleType 등을 포함.
 * 서비스에서는 roleType === SUB_HOST || SUPER_HOST 인지에 따라 isHost를 계산.
 */
export const MOCK_FIND_USERS_BY_SESSION_ID_DATA = [
  {
    user: { userId: 1, nickname: 'User1' },
    roleType: Roles.SUB_HOST, // 서비스에서 isHost: true
    token: 'subHostToken',
    userId: 1,
    sessionId: '123',
  },
  {
    user: { userId: 2, nickname: 'User2' },
    roleType: Roles.PARTICIPANT, // 서비스에서 isHost: false
    token: 'participantToken',
    userId: 2,
    sessionId: '123',
  },
];

/**
 * authorizeHost (호스트 권한 부여) 시나리오에 사용될 UpdateHostDto
 */
export const MOCK_UPDATE_HOST_DTO_SUPER_HOST = {
  sessionId: '123',
  isHost: true,
  token: 'superHostToken',
};

export const MOCK_UPDATE_HOST_DTO_INVALID_TOKEN = {
  sessionId: '123',
  isHost: true,
  token: 'invalidToken',
};

export const MOCK_UPDATE_HOST_DTO_SUPER_HOST_TOKEN_NOT_FOUND = {
  sessionId: '123',
  isHost: true,
  token: 'superHostToken',
};

/**
 * 자기 자신의 토큰을 변경하려고 시도하는 케이스(테스트에서 BadRequestException을 유도)
 */
export const MOCK_UPDATE_HOST_DTO_SELF_CHANGE = {
  sessionId: '123',
  isHost: true,
  token: 'superHostToken',
};
