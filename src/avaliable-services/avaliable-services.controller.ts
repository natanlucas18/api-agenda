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
import { AvaliableServicesService } from './avaliable-services.service';
import { CreateAvaliableServiceDto } from './dto/create-avaliable-service.dto';
import { UpdateAvaliableServiceDto } from './dto/update-avaliable-service.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@UseGuards(AuthTokenGuard)
@ApiBearerAuth()
@ApiTags('avaliable-services')
@Controller('avaliable-services')
export class AvaliableServicesController {
  constructor(
    private readonly avaliableServicesService: AvaliableServicesService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiOperation({summary:'Cria um novo serviço'})
  @ApiResponse({status: 201, description: 'Serviço criado com sucesso'})
  @ApiResponse({status: 409, description: 'Serviço que está tentando criar já existe'})
  create(@Body() createAvaliableServiceDto: CreateAvaliableServiceDto) {
    return this.avaliableServicesService.create(createAvaliableServiceDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({summary: 'Retorna todos os serviços'})
  @ApiResponse({status: 200, description: 'Serviços retornados com sucesso'})
  findAll(@Query() query: PaginationQueryDto) {
    return this.avaliableServicesService.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({summary: 'Retorna um serviço específico pelo ID'})
  @ApiParam({name: 'id', description: 'ID do serviço'})
  @ApiResponse({status: 200, description: 'Serviço retornado com sucesso'})
  @ApiResponse({status: 404, description: 'Serviço não encontrado'})
  findOne(@Param('id') id: string) {
    return this.avaliableServicesService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiOperation({summary: 'Atualiza um serviço existente'})
  @ApiParam({name: 'id', description: 'ID do serviço'})
  @ApiResponse({status: 200, description: 'Atualização de serviço bem-sucedida'})
  @ApiResponse({status: 404, description: 'Serviço não encontrado'})
  @ApiResponse({status: 409, description: 'Já existe um serviço com o nome no qual está tentando atualizar'})
  update(
    @Param('id') id: string,
    @Body() updateAvaliableServiceDto: UpdateAvaliableServiceDto,
  ) {
    return this.avaliableServicesService.update(id, updateAvaliableServiceDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiOperation({summary: 'Remove um serviço existente'})
  @ApiParam({name: 'id', description: 'ID do serviço'})
  @ApiResponse({status: 200, description: 'Serviço removido com sucesso'})
  @ApiResponse({status: 404, description: 'Serviço não encontrado'})
  remove(@Param('id') id: string) {
    return this.avaliableServicesService.remove(id);
  }
}
