module.exports = {
  apps: [
    {
      name: 'socket-server',
      script: 'pnpm',
      args: 'run start:prod:ws',
      interpreter: 'none',
      cwd: './',
      env: {
        PORT: 4000,
      },
    },
  ],
};
