import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { AvaliableServicesModule } from './avaliable-services/avaliable-services.module';
import { ProvidersModule } from './providers/providers.module';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      database: 'agenda',
      password: 'nl241839',
      autoLoadEntities: true,
      synchronize: true, // nao usar em produção
    }),
    AuthModule,
    UsersModule,
    AvaliableServicesModule,
    ProvidersModule,
    AppointmentsModule,
    ScheduleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
