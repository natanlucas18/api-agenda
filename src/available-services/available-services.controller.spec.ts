import { Test, TestingModule } from '@nestjs/testing';
import { AvailableServicesController } from './available-services.controller';

describe('AvailableServicesController', () => {
  let controller: AvailableServicesController;
  const AvailableServicesServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(() => {
    const controller = new AvailableServicesController(AvailableServicesServiceMock as any)
  });

  it('create - shoud use the aa')
});
