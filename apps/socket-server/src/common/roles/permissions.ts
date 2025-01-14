export const PermissionId = {
  1: 'TERMINATE_SESSION',
  2: 'GRANT_HOST',
  3: 'REVOKE_HOST',
  4: 'DELETE_QUESTION',
  5: 'DELETE_REPLY',
  6: 'PIN_QUESTION',
  7: 'CLOSE_QUESTION',
} as const;

type PermissionNumber = keyof typeof PermissionId;
type PermissionDescription = (typeof PermissionId)[PermissionNumber];

export const Permissions = Object.fromEntries(
  Object.entries(PermissionId).map(([key, value]) => [value, Number(key)]),
) as Record<PermissionDescription, PermissionNumber>;
