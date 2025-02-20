import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_SESSION',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          db: 0, // 세션용 DB
        });
      },
    },
    {
      provide: 'REDIS_TOKEN',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          db: 1, // 토큰용 DB
        });
      },
    },
    {
      provide: 'REDIS_REFRESH_TOKEN',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          db: 2,
        });
      },
    },
    {
      provide: 'REDIS_RESTRICT_TOKEN',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          db: 3,
        });
      },
    },
    {
      provide: 'REDIS_RESTRICT_IP',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          db: 4,
        });
      },
    },
  ],
  exports: ['REDIS_SESSION', 'REDIS_TOKEN', 'REDIS_REFRESH_TOKEN', 'REDIS_RESTRICT_TOKEN', 'REDIS_RESTRICT_IP'],
})
export class RedisModule {}
