export const getContentBodyLength = (body: string) => {
  const regex = /!?\[(\w+)\]\([^)]+\)/g;
  const matches = body.match(regex) || [];

  return matches.reduce((length, match) => {
    const textContent = /\[(\w+)\]/.exec(match)?.[1] || '';
    return length - match.trim().length + textContent.trim().length;
  }, body.trim().length);
};

export const isValidBodyLength = (body: string) => {
  return body.trim().length > 0 && body.trim().length <= 500;
};
