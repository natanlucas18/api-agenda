import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AvaliableServicesController } from './avaliable-services.controller';
import { AvaliableServicesService } from './avaliable-services.service';
import { AvaliableService } from './entities/avaliable-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AvaliableService]), UsersModule],
  controllers: [AvaliableServicesController],
  providers: [AvaliableServicesService],
  exports: [AvaliableServicesService, TypeOrmModule, AvaliableServicesModule],
})
export class AvaliableServicesModule {}
