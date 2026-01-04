import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../auth.constants';

export const SetRoles = (...roles: string[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
