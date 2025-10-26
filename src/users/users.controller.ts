import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { RoutePolicyGuard } from 'src/auth/guards/route-policy.guard';
import { tokenPayloadParams } from 'src/auth/params/token-payload.params';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body() updateUserDto: UpdateUserDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.usersService.update(id, updateUserDto, tokenPayloadDto);
  }

  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.usersService.remove(id, tokenPayloadDto);
  }
}
