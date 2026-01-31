import { Test, TestingModule } from '@nestjs/testing';
import { AvailableServicesController } from './available-services.controller';
import { AvailableServicesService } from './available-services.service';
import { UpdateAvailableServiceDto } from './dto/update-available-service.dto';
import { CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

describe('AvailableServicesController', () => {
  let controller: AvailableServicesController;
  let service: jest.Mocked<AvailableServicesService>;

  class AuthGuardMock implements CanActivate {
    canActivate(context: ExecutionContext) {
      return true;
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailableServicesController],
      providers: [
        {
          provide: AvailableServicesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(AuthTokenGuard)
    .useClass(AuthGuardMock)
    .overrideGuard(RolesGuard)
    .useClass(AuthGuardMock)
    .compile();

    controller = module.get(AvailableServicesController);
    service = module.get(AvailableServicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create with correct dto', async () => {
      const dto = { name: 'Corte americano', price: 50, duration: 30 };
      const expected = { success: true };

      service.create.mockResolvedValue(expected as any);

      const result = await controller.create(dto as any);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with query params', async () => {
      const query = { page: 1, limit: 10 };
      const expected = { data: [], meta: {} };

      service.findAll.mockResolvedValue(expected as any);

      const result = await controller.findAll(query as any);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      service.findOne.mockResolvedValue({} as any);

      await controller.findOne('uuid');

      expect(service.findOne).toHaveBeenCalledWith('uuid');
    });

    it('should propagate NotFoundException', async () => {
      service.findOne.mockRejectedValue(
        new NotFoundException('Serviço não encontrado'),
      );

      await expect(controller.findOne('uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateAvailableServiceDto = {
        name: 'Sobrancelha',
        price: 20,
        duration: 15,
      };

      service.update.mockResolvedValue({} as any);

      await controller.update('uuid', dto);

      expect(service.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      service.remove.mockResolvedValue({} as any);

      await controller.remove('uuid');

      expect(service.remove).toHaveBeenCalledWith('uuid');
    });
  });
});
