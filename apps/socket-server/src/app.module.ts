import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { LoggerModule } from './logger/logger.module';

import { ChatsModule } from '@chats/chats.module';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { HttpLoggerMiddleware } from '@common/middlewares/http-logger.middleware';
import { PrismaModule } from '@prisma-alias/prisma.module';
import { SocketModule } from '@socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    SocketModule,
    ChatsModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
