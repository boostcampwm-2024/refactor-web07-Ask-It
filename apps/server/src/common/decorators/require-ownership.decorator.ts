import { SetMetadata } from '@nestjs/common';

export const OWNERSHIP_KEY = 'ownership';

export const RequireOwnership = () => SetMetadata(OWNERSHIP_KEY, true);
