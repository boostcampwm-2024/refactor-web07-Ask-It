import { SetMetadata } from '@nestjs/common';

export const OWNERSHIP_KEY = 'ownership';

export const RequireOwnership = (resource: 'question' | 'reply') => SetMetadata(OWNERSHIP_KEY, resource);
