import { Module } from '@nestjs/common';

import { OwnershipGuard } from './ownership.guard';
import { PermissionOrOwnershipGuard } from './permission-or-ownership.guard';
import { PermissionGuard } from './permission.guard';

import { PrismaModule } from '@prisma-alias/prisma.module';
import { SessionsAuthRepository } from '@sessions-auth/sessions-auth.repository';

@Module({
  imports: [PrismaModule],
  providers: [PermissionGuard, OwnershipGuard, PermissionOrOwnershipGuard, SessionsAuthRepository],
  exports: [PermissionGuard, OwnershipGuard, PermissionOrOwnershipGuard, SessionsAuthRepository],
})
export class PermissionModule {}
