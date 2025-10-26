import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';
import jwtConfig from '../config/jwt.config';

export type JwtPayload = {
  sub: string;
  name: string;
  iat: number;
  exp: number;
};

export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @InjectRepository(User)
    private readonly pessoaRepository: Repository<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token inválido ou inexistente');
    }
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.pessoaRepository.findOneBy({
        id: Number(payload.sub),
        active: true,
      });
      if (!user) {
        throw new UnauthorizedException('Pessoa não autorizada!');
      }

      payload['user'] = user;
      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
    } catch {
      throw new UnauthorizedException('Falha na validação do token');
    }
    return true;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers?.authorization;
    if (!authorization || typeof authorization !== 'string') {
      return;
    }
    return authorization.split(' ')[1];
  }
}
