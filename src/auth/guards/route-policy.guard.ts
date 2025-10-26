import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_KEY, ROUTE_POLICY_KEY } from '../auth.constants';
import { Roles } from '../enum/roles';

export class RoutePolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const routePolicyRequired = this.reflector.get<Roles | undefined>(
      ROUTE_POLICY_KEY,
      context.getHandler(),
    );
    if (!routePolicyRequired) {
      return true; // Não há políticas de rota definidas
    }
    const request: Request = context.switchToHttp().getRequest();
    const tokenPayload = request[REQUEST_TOKEN_PAYLOAD_KEY];

    // Verifica se o tokenPayload existe e se a política de rota requerida é atendida
    if (!tokenPayload) {
      throw new UnauthorizedException(
        'Rota requer permissão. Usuário não autenticado.',
      );
    }

    const { user } = tokenPayload;
    if (!user.routePolicies.includes(routePolicyRequired)) {
      throw new ForbiddenException(
        'Usuário não possui permissão para acessar esta rota.',
      );
    }

    return true;
  }
}
