const isPrimitive = (value: unknown): boolean => {
  return value === null || (typeof value !== 'object' && typeof value !== 'function');
};

const areArraysEqual = (lhs: unknown[], rhs: unknown[]): boolean => {
  if (lhs.length !== rhs.length) return false;
  return lhs.every((item, index) => deepEqual(item, rhs[index]));
};

const areObjectsEqual = (lhs: Record<string, unknown>, rhs: Record<string, unknown>): boolean => {
  const lhsKeys = Object.keys(lhs);
  const rhsKeys = Object.keys(rhs);

  if (lhsKeys.length !== rhsKeys.length) return false;

  return lhsKeys.every((key) => deepEqual(lhs[key], rhs[key]));
};

export const deepEqual = (lhs: unknown, rhs: unknown): boolean => {
  if (lhs === rhs) return true;
  if (isPrimitive(lhs) || isPrimitive(rhs)) return false;

  if (Array.isArray(lhs) && Array.isArray(rhs)) {
    return areArraysEqual(lhs, rhs);
  }

  if (typeof lhs === 'object' && typeof rhs === 'object') {
    return areObjectsEqual(lhs as Record<string, unknown>, rhs as Record<string, unknown>);
  }

  return false;
};
