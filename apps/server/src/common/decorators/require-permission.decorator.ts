import { SetMetadata } from '@nestjs/common';

export const PERMISSION_KEY = 'permission';

export const RequirePermission = (permission: number) => SetMetadata(PERMISSION_KEY, permission);
