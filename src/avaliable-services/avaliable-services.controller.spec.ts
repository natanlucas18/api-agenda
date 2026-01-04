import { Test, TestingModule } from '@nestjs/testing';
import { AvaliableServicesController } from './avaliable-services.controller';
import { AvaliableServicesService } from './avaliable-services.service';

describe('AvaliableServicesController', () => {
  let controller: AvaliableServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvaliableServicesController],
      providers: [AvaliableServicesService],
    }).compile();

    controller = module.get<AvaliableServicesController>(AvaliableServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
