import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { tokenPayloadParams } from 'src/auth/params/token-payload.params';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiOperation({summary: 'Cria um novo usuário'})
  @ApiResponse({status: 201, description: 'Usuário criado com sucesso'})
  @ApiResponse({status: 400, description: 'Dados inválidos'})
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Retorna um usuário específico pelo ID'})
  @ApiParam({name: 'id', description: 'Id do usário'})
  @ApiResponse({status: 200, description: 'Usuário retornado com sucesso'})
  @ApiResponse({status: 404, description: 'Usuário não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Atualiza um usuário existente'})
  @ApiParam({name: 'id', description: 'ID do usuário'})
  @ApiResponse({status: 200, description: 'Atualização de usuário bem-sucedida'})
  @ApiResponse({status: 400, description: 'Dados inválidos'})
  @ApiResponse({status: 403, description: 'Não possui permissão para atualizar o usuário'})
  @ApiResponse({status: 404, description: 'Usuário não encontrado'})
  update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body() updateUserDto: UpdateUserDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.usersService.update(id, updateUserDto, tokenPayloadDto);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({summary: 'Remove um usuário existente'})
  @ApiParam({name:'id', description: 'ID do usuário'})
  @ApiResponse({status: 200, description: 'Usuário removido com sucesso'})
  @ApiResponse({status: 400, description: 'Dados inválidos'})
  @ApiResponse({status: 403, description: 'Não possui permissão para remover o usuário'})
  @ApiResponse({status: 404, description: 'Usuário não encontrado'})
  remove(
    @Param('id', ParseIntPipe) id: number,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.usersService.remove(id, tokenPayloadDto);
  }
}
