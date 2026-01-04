import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProvidersService } from './providers.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@UseGuards(AuthTokenGuard)
@ApiBearerAuth()
@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiOperation({summary: 'Cria um novo profissional'})
  @ApiResponse({status: 201, description: 'Profissional criado com sucesso'})
  @ApiResponse({status: 409, description: 'O profissional já existe'})
  create(@Body() createProviderDto: CreateProviderDto) {
    console.log(createProviderDto);
    return this.providersService.create(createProviderDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({summary: 'Retorna todos os profissionais'})
  @ApiResponse({status: 200, description: 'Profissionais retornados com sucesso'})
  findAll(@Query() query: PaginationQueryDto) {
    return this.providersService.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({summary: 'Retorna um profissional específico pelo ID'})
  @ApiParam({name: 'id', description: 'ID do profissional'})
  @ApiResponse({status: 200, description: 'Profissinal retornado com sucesso'})
  @ApiResponse({status: 404, description: 'Profissional não encontrado'})
  findOne(@Param('id') id: string) {
    return this.providersService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiOperation({summary: 'Atualiza um profissional existente'})
  @ApiParam({name: 'id', description: 'ID do profissional'})
  @ApiResponse({status: 200, description: 'Atualização de profissional bem-sucedida'})
  @ApiResponse({status: 404, description: 'Profissional não encontrado'})
  @ApiResponse({status: 409, description: 'Dados inválidos'})
  update(
    @Param('id') id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ) {
    return this.providersService.update(id, updateProviderDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove um profissional existente'})
  @ApiParam({name: 'id', description: 'ID do profissional'})
  @ApiResponse({status: 200, description: 'Profissional removido com sucesso'})
  @ApiResponse({status: 404, description: 'Profissional não encontrado'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.providersService.remove(id);
  }
}
