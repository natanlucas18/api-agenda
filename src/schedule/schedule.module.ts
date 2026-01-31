import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from 'src/providers/entities/provider.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { BlockedSlot } from './entities/blocked-slot.entity';
import { User } from 'src/users/entities/user.entity';
import { AvailableService } from 'src/available-services/entities/available-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Provider, Appointment, BlockedSlot, User, AvailableService])],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService]
})
export class ScheduleModule {}
