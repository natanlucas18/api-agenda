import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvaliableService } from 'src/avaliable-services/entities/avaliable-service.entity';
import { Provider } from 'src/providers/entities/provider.entity';
import { UsersModule } from 'src/users/users.module';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Provider, AvaliableService]),
    UsersModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
