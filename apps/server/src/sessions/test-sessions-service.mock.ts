import { Roles } from '@common/roles/roles';
export const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const MOCK_BASE_DATE = new Date('2025-01-01T00:00:00.000Z');
export const MOCK_SESSION_END_DATE = new Date(MOCK_BASE_DATE.getTime() - ONE_WEEK_MS);

export const MOCK_USER = {
  userId: 1,
  nickname: 'TestUser',
  email: 'test@example.com',
  password: 'hashedPassword',
  createdAt: MOCK_BASE_DATE,
};

export const MOCK_SESSION = {
  sessionId: '123',
  title: '테스트 세션',
  createdAt: MOCK_BASE_DATE,
  expiredAt: MOCK_SESSION_END_DATE,
  createUserId: MOCK_USER.userId,
};

export const MOCK_SESSIONS = [
  {
    sessionId: '123123',
    title: '테스트 세션',
    createdAt: MOCK_BASE_DATE,
    expiredAt: MOCK_SESSION_END_DATE,
  },
  {
    ...MOCK_SESSION,
    createdAt: MOCK_BASE_DATE,
    expiredAt: MOCK_SESSION_END_DATE,
  },
];

export const MOCK_SESSION_AUTH_HOST = {
  userId: MOCK_USER.userId,
  roleType: Roles.SUPER_HOST,
  token: 'mockToken',
  sessionId: MOCK_SESSION.sessionId,
  role: {
    permissions: [
      { permissionId: 1 },
      { permissionId: 2 },
      { permissionId: 3 },
      { permissionId: 4 },
      { permissionId: 5 },
      { permissionId: 6 },
      { permissionId: 7 },
    ],
  },
};

export const MOCK_SESSION_AUTH_NON_HOST = {
  userId: 2,
  roleType: Roles.PARTICIPANT,
  token: 'test-token',
  sessionId: MOCK_SESSION.sessionId,
  role: {
    permissions: [],
  },
};

export const MOCK_CREATED_SESSION = {
  ...MOCK_SESSION,
  user: {
    connect: { userId: MOCK_USER.userId },
  },
};
