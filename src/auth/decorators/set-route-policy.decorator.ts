import { SetMetadata } from '@nestjs/common';
import { ROUTE_POLICY_KEY } from '../auth.constants';
import { Roles } from '../enum/roles';

export const SetRoutePolicy = (policies: Roles) => {
  return SetMetadata(ROUTE_POLICY_KEY, policies);
};
