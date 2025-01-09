import { Reply } from '@prisma/client';

import { Permissions } from '@common/roles/permissions';
import { Roles } from '@common/roles/roles';

export const MOCK_DATE = new Date('2025-01-01T00:00:00.000Z');

/** 기본 Reply Mock */
export const MOCK_REPLY: Reply = {
  replyId: 1,
  body: 'Test reply',
  createUserToken: 'token', // 기본 소유자 토큰: "token"
  createdAt: MOCK_DATE,
  deleted: false,
  questionId: 1,
  sessionId: '123',
};

/** 추가 필드 (createUserTokenEntity 등) 포함 버전 */
export const MOCK_REPLY_WITH_ENTITY = {
  ...MOCK_REPLY,
  createUserTokenEntity: {
    user: {
      userId: 1,
      nickname: 'TestUser',
      email: 'test@example.com',
      password: 'hashedPassword',
      createdAt: MOCK_DATE,
    },
  },
};

/** 새로 생성될 답글 */
export const MOCK_CREATED_REPLY = {
  ...MOCK_REPLY_WITH_ENTITY,
  replyId: 2,
  body: 'New Test Reply',
};

/** 업데이트된 답글 */
export const MOCK_UPDATED_REPLY = {
  ...MOCK_REPLY,
  body: 'Updated reply',
};

/** 좋아요(Mock ReplyLike) */
export const MOCK_REPLY_LIKE = {
  replyLikeId: 1,
  replyId: 1,
  createUserToken: 'token',
  reply: {
    ...MOCK_REPLY,
  },
};

/** 세션 인증 Mock: 권한이 없는 일반 사용자 */
export const MOCK_SESSION_AUTH_NO_PERM = {
  role: {
    roleType: Roles.PARTICIPANT,
    permissions: [],
  },
  token: 'noPermToken',
};

/** 세션 인증 Mock: DELETE_REPLY 권한이 있는 사용자 */
export const MOCK_SESSION_AUTH_WITH_DELETE = {
  role: {
    roleType: Roles.SUB_HOST,
    permissions: [{ permissionId: Permissions.DELETE_REPLY }],
  },
  token: 'hasDeleteToken',
};

/** 세션 인증 Mock: 그냥 'token'이 소유자인 경우 */
export const MOCK_SESSION_AUTH_OWNER = {
  role: {
    roleType: Roles.PARTICIPANT,
    permissions: [],
  },
  token: 'token', // 소유자와 같은 'token'
};

/** 기타 케이스: 소유자와도 다르고, 권한도 없는 사용자 */
export const MOCK_SESSION_AUTH_OTHER = {
  role: {
    roleType: Roles.PARTICIPANT,
    permissions: [],
  },
  token: 'otherToken',
};
