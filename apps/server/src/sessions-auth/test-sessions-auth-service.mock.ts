export const MOCK_SESSION_AUTH_DTO_WITHOUT_TOKEN = {
  sessionId: '123',
  token: null,
};

export const MOCK_SESSION_AUTH_DTO_WITH_TOKEN = {
  sessionId: '123',
  token: 'existingToken',
};

export const MOCK_FIND_USERS_BY_SESSION_ID_DATA = [
  {
    user: { userId: 1, nickname: 'User1' },
    isHost: true,
    token: 'someGeneratedToken',
    userId: 1,
    sessionId: 'someSessionId',
  },
  {
    user: { userId: 2, nickname: 'User2' },
    isHost: false,
    token: 'someGeneratedToken',
    userId: 1,
    sessionId: 'someSessionId',
  },
];

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

export const MOCK_UPDATE_HOST_DTO_SELF_CHANGE = {
  sessionId: '123',
  isHost: true,
  token: 'targetToken',
};
