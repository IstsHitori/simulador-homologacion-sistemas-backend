import { SetMetadata } from '@nestjs/common';
import { META_ROLES } from 'src/auth/constants';
import { ROLE } from 'src/user/constants';

export const RoleProtected = (...args: ROLE[]) => {
  return SetMetadata(META_ROLES, args);
};
