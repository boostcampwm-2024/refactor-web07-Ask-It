export const getContentBodyLength = (body: string) => {
  let length = body.trim().length;

  const regex = /!?\[(\w+)\]\([^)]+\)/g;
  const matches = body.match(regex) || [];

  matches.forEach((match) => {
    const textContent = /\[(\w+)\]/.exec(match)?.[1] || '';
    length = length - match.trim().length + textContent.trim().length;
  });

  return length;
};

export const isValidBodyLength = (body: string) => {
  return body.trim().length > 0 && body.trim().length <= 500;
};
