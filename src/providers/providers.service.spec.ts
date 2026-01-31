import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersService } from './providers.service';
import { Provider } from './entities/provider.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProvidersService', () => {
  let providerService: ProvidersService;
  let providerRepo: jest.Mocked<Repository<Provider>>

  const mockProvider: Provider = {
    id: 'uuid-2',
    name: 'Natan',
    workingHours: {
      "tuesday": {
        "start": "09:00",
        "end": "22:30"
      },
      "wednesday": {
        "start": "09:00",
        "end": "22:30"
      },
    },
    blockedSlots: [],
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProvidersService, {
        provide: getRepositoryToken(Provider),
        useValue: {
          create: jest.fn(),
          findAll: jest.fn(),
          findOneBy: jest.fn(),
          preload: jest.fn(),
          remove: jest.fn(),
          save: jest.fn(),
          createQueryBuilder: jest.fn(),
        }
      }],
    }).compile();

    providerService = module.get<ProvidersService>(ProvidersService);
    providerRepo = module.get(getRepositoryToken(Provider))
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(providerService).toBeDefined();
  });

  describe('create', () => {
    it('must successfully create a new provider', async () => {
      providerRepo.findOneBy.mockResolvedValue(null);
      providerRepo.create.mockReturnValue(mockProvider);
      providerRepo.save.mockResolvedValue(mockProvider);

      const result = await providerService.create({
        name: 'Natan',
        workingHours: {
          "tuesday": {
            "start": "09:00",
            "end": "22:30"
          },
          "wednesday": {
            "start": "09:00",
            "end": "22:30"
          },
        }
      });

      expect(providerRepo.create).toHaveBeenCalled()
      expect(providerRepo.save).toHaveBeenCalledWith(mockProvider);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProvider);
    });


    it('should throw a ConflictEception if the provider already exists', async () => {
      providerRepo.findOneBy.mockResolvedValue(mockProvider);

      expect(providerService.create({
        name: 'Natan',
        workingHours: {
          "tuesday": {
            "start": "09:00",
            "end": "22:30"
          },
          "wednesday": {
            "start": "09:00",
            "end": "22:30"
          },
        }
      })).rejects.toThrow(
        ConflictException
      )
    })
  });

  describe('findAll', () => {
    it('should return a paginated list', async () => {
      const qb: any = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockProvider], 1])
      };

      providerRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await providerService.findAll({
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'ASC'
      });

      expect(result.data).toHaveLength(1);
      expect(result.meta.totalItems).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a provider by ID', async () => {
      providerRepo.findOneBy.mockResolvedValue(mockProvider);

      const result = await providerService.findOne('uuid-2');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockProvider);
    });

    it('should throw a NotFoundException if not exist', async () => {
      providerRepo.findOneBy.mockResolvedValue(null);

      await expect(providerService.findOne('uuid-2')).rejects.toThrow(
        NotFoundException
      );
    })
  });

  describe('update', () => {
    it('must update a provider succefully', async () => {
      providerRepo.preload.mockResolvedValue(mockProvider);
      providerRepo.save.mockResolvedValue(mockProvider);

      const result = await providerService.update('uuid-2', {
        name: 'Lucas',
      });

      expect(providerRepo.preload).toHaveBeenCalled();
      expect(providerRepo.save).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it('should throw a NotFoundException if it cannot find', async () => {
      providerRepo.preload.mockResolvedValue(null);

      await expect(providerService.update('uuid-2', {
        name: 'Lucas',
      })).rejects.toThrow(
        NotFoundException
      )
    });

    it('should throw a ConflictExcpetion for an error  in the unique key', async () => {
      providerRepo.preload.mockResolvedValue(mockProvider);
      providerRepo.save.mockRejectedValue({
        code: '23505',
      });

      await expect(providerService.update('uuid-2', {
        name: 'Nome duplicado',
      })).rejects.toThrow(
        ConflictException
      );
    })
  });

  describe('remove', () => {
    it('must successfully remove a provider', async () => {
      providerRepo.findOneBy.mockResolvedValue(mockProvider);
      providerRepo.remove.mockResolvedValue(mockProvider);

      const result = await providerService.remove('uuid-2');

      expect(providerRepo.remove).toHaveBeenCalledWith(mockProvider)
      expect(result.success).toBe(true);
    });

    it('should throw a NotFoundException if the provider does not found', async () => {
      providerRepo.findOneBy.mockResolvedValue(null);

      await expect(providerService.remove('uuid-2')).rejects.toThrow(
        NotFoundException
      )
    })
  })
});
