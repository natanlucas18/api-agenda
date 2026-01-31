import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { CanActivate, ConflictException, ExecutionContext, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';

describe('ProvidersController', () => {
  let controller: ProvidersController;
  let providerService: jest.Mocked<ProvidersService>;

  class AuthGuardMock implements CanActivate {
    canActivate(context: ExecutionContext){
      return true;
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvidersController],
      providers: [{
        provide: ProvidersService,
        useValue: {
          create: jest.fn(),
          findAll: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn(),
          remove: jest.fn()
        },
      }],
    })
    .overrideGuard(AuthTokenGuard)
    .useClass(AuthGuardMock)
    .overrideGuard(RolesGuard)
    .useClass(AuthGuardMock)
    .compile();

    controller = module.get<ProvidersController>(ProvidersController);
    providerService = module.get(ProvidersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call providerService.create with correct dto', async () => {
      const dto:CreateProviderDto = {
        name: 'Lucas',
        workingHours: {
          "monday": {
            "start": "08:00",
            "end": "21:00"
          },
          "friday": {
            "start": "09:30",
            "end": "20:00" 
          },
        }
      };
      const expected = { success: true};

      providerService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);

      expect(providerService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });

    it('should propagate ConflictException', async () => {
      providerService.create.mockRejectedValue(
        new ConflictException('Esse profissional já existe')
      );

      await expect(controller.create({
        name: 'Lucas',
        workingHours: {
          "monday": {
            "start": "08:00",
            "end": "21:00"
          },
          "friday": {
            "start": "09:30",
            "end": "20:00" 
          },
        }
      })).rejects.toThrow(ConflictException)
    })
  });

  describe('findAll', () => {
    it('should call providerService.findAll with query params', async () => {
      const query = {page: 1, limit: 10};
      const expected = {data: [], meta: {}};

      providerService.findAll.mockResolvedValue(expected as any)

      const result = await controller.findAll(query);

      expect(providerService.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expected);
    })
  });

  describe('findOne', () => {
    it('should call providerService.findOne with ID', async () => {
      const expected = {id: 'uuid'}
      providerService.findOne.mockResolvedValue(expected as any)

      const result = await controller.findOne('uuid');

      expect(providerService.findOne).toHaveBeenCalledWith('uuid');
      expect(result).toEqual(expected);
    });

    it('should propagate NotFoundException', async () => {
      providerService.findOne.mockRejectedValue(
        new NotFoundException('Profissional não encontrado')
      );

      await expect(controller.findOne('uuid')).rejects.toThrow(
        NotFoundException
      )
    })
  });

  describe('update', () => {
    it('should call providerService.update with id and dto', async () => {
      const updateDto: UpdateProviderDto = {
        name: 'Natan',
        workingHours: {
          "monday": {
            "start": "08:00",
            "end": "21:00"
          },
          "friday": {
            "start": "09:30",
            "end": "20:00" 
          },
        }
      };

      providerService.update.mockResolvedValue({} as any);

      const result = await controller.update('uuid', updateDto);

      expect(providerService.update).toHaveBeenCalledWith('uuid', updateDto);
    });

    it('should propagate ConflictException', async () => {
      providerService.update.mockRejectedValue(
        new ConflictException('Nome inválido! já existe um profissional com esse nome')
      );

      await expect(controller.update('uuid', {
        name: 'Natan',
        workingHours: {
          "monday": {
            "start": "08:00",
            "end": "21:00"
          },
          "friday": {
            "start": "09:30",
            "end": "20:00" 
          },
        }
      })).rejects.toThrow(
        ConflictException
      )
    })
  })
});
