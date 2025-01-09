import { Permissions } from '@common/roles/permissions';
import { Roles } from '@common/roles/roles';

export const MOCK_DATE = new Date('2025-01-01T00:00:00.000Z');
export const MOCK_DATE_ONE_HOUR_LATER = new Date(MOCK_DATE.getTime() + 60 * 60 * 1000);

export const MOCK_USER = {
  userId: 1,
  nickname: 'TestUser',
  email: 'test@example.com',
  password: 'hashedPassword',
  createdAt: MOCK_DATE,
};

export const MOCK_REPLY_USER = {
  userId: 2,
  nickname: 'ReplyUser',
  email: 'reply@example.com',
  password: 'hashedPassword',
  createdAt: MOCK_DATE_ONE_HOUR_LATER,
};

export const MOCK_QUESTION = {
  questionId: 1,
  sessionId: 'test-session',
  body: 'Test question',
  closed: false,
  pinned: false,
  createdAt: MOCK_DATE,
  createUserToken: 'test-token',
  createUserTokenEntity: {
    user: { ...MOCK_USER },
  },
  questionLikes: [
    {
      createUserToken: 'like-token',
    },
  ],
  replies: [
    {
      replyId: 1,
      body: 'Test reply',
      createUserToken: 'reply-token',
      questionId: 1,
      sessionId: 'test-session',
      createdAt: MOCK_DATE_ONE_HOUR_LATER,
      deleted: false,
      replyLikes: [
        {
          createUserToken: 'reply-like-token',
        },
      ],
      createUserTokenEntity: {
        user: { ...MOCK_REPLY_USER },
      },
    },
  ],
};

export const MOCK_CREATED_QUESTION = {
  questionId: 1,
  createUserToken: 'test-token',
  sessionId: 'test-session',
  body: 'Test question',
  closed: false,
  pinned: false,
  createdAt: MOCK_DATE,
  createUserTokenEntity: {
    user: { ...MOCK_USER },
  },
};

export const MOCK_SESSION = {
  sessionId: 'test-session',
  createdAt: MOCK_DATE,
  title: 'Test Session',
  expiredAt: new Date(MOCK_DATE.getTime() + 7 * 24 * 60 * 60 * 1000),
  createUserId: 1,
};

export const MOCK_HOST_TOKENS = [
  {
    sessionId: 'test-session',
    token: 'host-token',
    userId: 1,
    roleType: Roles.SUPER_HOST,
    role: {
      permissions: [],
      name: Roles.SUPER_HOST,
    },
  },
];

export const MOCK_SESSION_AUTH_HOST = {
  roleType: Roles.SUPER_HOST,
  token: 'test-token',
  userId: 1,
  sessionId: 'test-session',
  role: {
    permissions: [
      {
        roleName: Roles.SUPER_HOST,
        permissionId: Permissions.DELETE_QUESTION,
      },
      {
        roleName: Roles.SUPER_HOST,
        permissionId: Permissions.PIN_QUESTION,
      },
    ],
    name: Roles.SUPER_HOST,
  },
};

export const MOCK_SESSION_AUTH_NON_HOST = {
  roleType: Roles.PARTICIPANT,
  token: 'test-token',
  userId: 1,
  sessionId: 'test-session',
  role: {
    permissions: [],
    name: Roles.PARTICIPANT,
  },
};
