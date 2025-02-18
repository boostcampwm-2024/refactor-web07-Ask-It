import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { AiModule } from '@ai/ai.module';
import { AuthModule } from '@auth/auth.module';
import { ChatsModule } from '@chats/chats.module';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { HttpLoggerMiddleware } from '@common/middlewares/http-logger.middleware';
import { RedisModule } from '@common/redis.module';
import { LoggerModule } from '@logger/logger.module';
import { PrismaModule } from '@prisma-alias/prisma.module';
import { QuestionsModule } from '@questions/questions.module';
import { RepliesModule } from '@replies/replies.module';
import { SessionsModule } from '@sessions/sessions.module';
import { SessionsAuthModule } from '@sessions-auth/sessions-auth.module';
import { SocketModule } from '@socket/socket.module';
import { UploadModule } from '@upload/upload.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    RedisModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    PrismaModule,
    SessionsModule,
    SessionsAuthModule,
    QuestionsModule,
    RepliesModule,
    AuthModule,
    UploadModule,
    SocketModule,
    ChatsModule,
    LoggerModule,
    AiModule,
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
