import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import jwtConfig from './config/jwt.config';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { HashingService } from './hashing/hashing.service';
import { ResponseDto } from 'src/common/dtos/response.dto';

export type GenerateTokens = {
    id: number;
    name: string;
    email: string;
    roles: string[];
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto):Promise<GenerateTokens> {
    const user = await this.userRepository.findOneBy({
      email: loginDto.email,
      active: true,
    });
    if (!user) {
      throw new UnauthorizedException('Usuário não autorizado');
    }
    const passwordIsValid = await this.hashingService.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!passwordIsValid) {
      throw new UnauthorizedException('Senha inválida!');
    }
    return this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    const accessTokenPromise = this.signJwtAsync<Partial<User>>(
      user.id,
      this.jwtConfiguration.expiresIn,
      {
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
    );
    const refreshTokenPromise = this.signJwtAsync(
      user.id,
      this.jwtConfiguration.jwtRefreshTtl,
    );

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      accessToken,
      refreshToken
    };
  }

  private signJwtAsync<T>(sub: number, expiresIn: number, payload?: T) {
    return this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto):Promise<GenerateTokens>{
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        this.jwtConfiguration,
      );

      const user = await this.userRepository.findOne({
        where: { id: Number(sub), active: true },
      });

      if (!user) {
        throw new Error('Usuário não autorizado');
      }
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Refresh token Iválido ou expirado');
    }
  }
}
