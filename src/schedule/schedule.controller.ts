import { Controller, Get, Post, Body, Delete, Query, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { UnblockSlotDto } from './dto/unblock-slot.dto';
import { BlockSlotDto } from './dto/block-slot.dto';
import { SetRoles } from 'src/auth/decorators/set-roles.decorator';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(AuthTokenGuard,RolesGuard)
@ApiTags('schedule')
@ApiBearerAuth()
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @SetRoles('user')
  @Get('available/:providerId')
  @ApiOperation({ summary: 'Listar horários disponíveis' })
  @ApiParam({name: 'providerId', description: 'ID do profissional'})
  @ApiQuery({name: 'serviceId', description: 'ID do serviço'})
  @ApiQuery({name: 'date', description: 'Data que está buscando horário'})
  @ApiResponse({status: 200, description: 'Horários retornados com sucesso.'})
  @ApiResponse({status: 400, description: 'Dados inválidos.'})
  @HttpCode(HttpStatus.OK)
  getAvailableTimes(
    @Param('providerId') providerId: string,
    @Query('serviceId') serviceId: string,
    @Query('date') date:string) {
    return this.scheduleService.getAvailableTimes(providerId, serviceId, date);
  }

  @SetRoles('admin')
  @Post('block')
  @ApiOperation({ summary: 'Bloquear horário' })
  @ApiResponse({status: 200, description: 'Horário bloqueado com sucesso.'})
  @ApiResponse({status: 409, description: 'Horário informado já está bloqueado'})
  @ApiResponse({status: 400, description: 'Dados inválidos'})
  @HttpCode(HttpStatus.OK)
  blockSlot(@Body() dto: BlockSlotDto) {
    return this.scheduleService.blockSlot(dto.providerId, dto.date, dto.time, dto.duration, dto.reason);
  }

  
  @SetRoles('admin')
  @Delete('unblock')
  @ApiOperation({ summary: 'Desbloquear horário' })
  @ApiResponse({status: 200, description: 'Horário desbloqueado com sucesso.'})
  @ApiResponse({status: 400, description: 'Dados inválidos'})
  @HttpCode(HttpStatus.OK)
  unblockSlot(@Body() dto: UnblockSlotDto) {
    return this.scheduleService.unblockSlot(
      dto.providerId,
      dto.date,
      dto.time,
    );
  }
}
