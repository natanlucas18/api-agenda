import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SetRoles } from 'src/auth/decorators/set-roles.decorator';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


@UseGuards(AuthTokenGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @SetRoles('user')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiOperation({summary: 'Cria um novo agendamento'})
  @ApiResponse({status: 201, description: 'Agendamento criado com sucesso'})
  @ApiResponse({status: 409, description: 'Dados inválidos'})
  create(@Body() createAppointmentDto: Partial<Appointment>) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @SetRoles('user')
  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({summary: 'Retorna todos os agendamentos'})
  @ApiResponse({status: 200, description: 'Agendamentos retornados com sucesso'})
  findAll(@Query() query: AppointmentQueryDto) {
    return this.appointmentsService.findAll(query);
  }

  @SetRoles('user')
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({summary: 'Retorna um agendamento específico pelo ID'})
  @ApiParam({name:'id', description: 'ID do agendamento'})
  @ApiResponse({status: 200, description: 'Agendamento retornado com sucesso'})
  @ApiResponse({status: 404, description: 'Agendamento não encontrado'})
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @SetRoles('user')
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiOperation({summary: 'Remove um agendamento existente'})
  @ApiParam({name: 'id', description: 'ID do agendamento'})
  @ApiResponse({status: 200, description: 'Agendamento removido com sucesso'})
  @ApiResponse({status: 404, description: 'Agendamento não encontrado'})
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
