import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import Redis from 'ioredis';
import { v4 as uuid4 } from 'uuid';

import { LoginDto } from './dto/login.dto';
import { InvalidCredentialsException, RefreshTokenException } from './exceptions/auth.exception';

import { UsersRepository } from '@users/users.repository';

interface RefreshTokenData {
  userId: number;
  nickname: string;
}

@Injectable()
export class AuthService {
  private readonly REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    @Inject('REDIS_REFRESH_TOKEN') private readonly refreshTokensRedisClient: Redis,
  ) {}

  async getInfo(refreshToken: string) {
    const refreshTokenData: RefreshTokenData = JSON.parse(await this.refreshTokensRedisClient.get(refreshToken));
    return refreshTokenData ? refreshTokenData.userId : null;
  }

  getRefreshTokenExpireTime() {
    return this.REFRESH_TOKEN_TTL;
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.usersRepository.findByEmail(loginDto.email);
    if (!user) throw InvalidCredentialsException.invalidEmail();

    const match = await bcrypt.compare(loginDto.password, user.password);
    if (!match) throw InvalidCredentialsException.invalidPassword();

    return { userId: user.userId, nickname: user.nickname };
  }

  async generateRefreshToken(userId: number, nickname: string) {
    const token = uuid4();
    const tokenData: RefreshTokenData = {
      userId,
      nickname,
    };

    await this.refreshTokensRedisClient.set(token, JSON.stringify(tokenData), 'EX', this.REFRESH_TOKEN_TTL);
    return token;
  }

  async generateAccessToken(refreshToken: string) {
    const tokenData: RefreshTokenData = await this.validateRefreshToken(refreshToken);
    return this.jwtService.sign(tokenData, {
      expiresIn: '2d',
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }

  private async validateRefreshToken(refreshToken: string) {
    const tokenData = await this.refreshTokensRedisClient.get(refreshToken);
    if (!tokenData) throw RefreshTokenException.invalid();
    return JSON.parse(tokenData);
  }

  async removeRefreshToken(refreshToken: string) {
    await this.refreshTokensRedisClient.del(refreshToken);
  }
}
