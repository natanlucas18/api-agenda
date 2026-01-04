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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { AvailableServicesService } from './available-services.service';
import { CreateAvailableServiceDto } from './dto/create-available-service.dto';
import { UpdateAvailableServiceDto } from './dto/update-available-service.dto';

@UseGuards(AuthTokenGuard)
@ApiBearerAuth()
@ApiTags('available-services')
@Controller('available-services')
export class AvailableServicesController {
  constructor(
    private readonly availableServicesService: AvailableServicesService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiOperation({summary:'Cria um novo serviço'})
  @ApiResponse({status: 201, description: 'Serviço criado com sucesso'})
  @ApiResponse({status: 409, description: 'Serviço que está tentando criar já existe'})
  create(@Body() createAvailableServiceDto: CreateAvailableServiceDto) {
    return this.availableServicesService.create(createAvailableServiceDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({summary: 'Retorna todos os serviços'})
  @ApiResponse({status: 200, description: 'Serviços retornados com sucesso'})
  findAll(@Query() query: PaginationQueryDto) {
    return this.availableServicesService.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({summary: 'Retorna um serviço específico pelo ID'})
  @ApiParam({name: 'id', description: 'ID do serviço'})
  @ApiResponse({status: 200, description: 'Serviço retornado com sucesso'})
  @ApiResponse({status: 404, description: 'Serviço não encontrado'})
  findOne(@Param('id') id: string) {
    return this.availableServicesService.findOne(id);
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
    @Body() updateAvailableServiceDto: UpdateAvailableServiceDto,
  ) {
    return this.availableServicesService.update(id, updateAvailableServiceDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiOperation({summary: 'Remove um serviço existente'})
  @ApiParam({name: 'id', description: 'ID do serviço'})
  @ApiResponse({status: 200, description: 'Serviço removido com sucesso'})
  @ApiResponse({status: 404, description: 'Serviço não encontrado'})
  remove(@Param('id') id: string) {
    return this.availableServicesService.remove(id);
  }
}
