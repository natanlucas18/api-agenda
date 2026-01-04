import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({summary: 'Efetua o login do usuário'})
  @ApiResponse({status: 200, description: 'Login efetuado com sucesso'})
  @ApiResponse({status: 401, description: 'Dados inválidos'})
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @ApiOperation({summary: 'Efetua o refresh do token'})
  @ApiResponse({status: 200, description: 'Token atualizado com sucesso'})
  @ApiResponse({status: 401, description: 'Dados inválidos'})
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
