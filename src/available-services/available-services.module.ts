import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AvailableService } from './entities/available-service.entity';
import { AvailableServicesController } from './available-services.controller';
import { AvailableServicesService } from './available-services.service';

@Module({
  imports: [TypeOrmModule.forFeature([AvailableService]), UsersModule],
  controllers: [AvailableServicesController],
  providers: [AvailableServicesService],
  exports: [AvailableServicesService, TypeOrmModule, AvailableServicesModule],
})
export class AvailableServicesModule {}
