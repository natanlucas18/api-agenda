import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AvailableServicesService } from './available-services.service';
import { AvailableService } from './entities/available-service.entity';

describe('AvailableServicesService', () => {
  let service: AvailableServicesService;
  let serviceRepo: jest.Mocked<Repository<AvailableService>>

  const mockService:AvailableService = {
    id: 'uuid-1',
    name: 'Corte americano',
    price: 45,
    duration: 30,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvailableServicesService, {
        provide: getRepositoryToken(AvailableService),
        useValue: {
          create: jest.fn(),
          findAll: jest.fn(),
          findOneBy: jest.fn(),
          preload: jest.fn(),
          save: jest.fn(),
          remove: jest.fn(),
          createQueryBuilder: jest.fn()
        }
      }],
    }).compile();

    service = module.get<AvailableServicesService>(AvailableServicesService)
    serviceRepo = module.get(getRepositoryToken(AvailableService));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('must successfully create a new service', async () => {
      // Arrange
        serviceRepo.findOneBy.mockResolvedValue(null);
        serviceRepo.create.mockReturnValue(mockService);
        serviceRepo.save.mockResolvedValue(mockService);      

      // Act
      const result = await service.create({
        name: 'Corte americano',
        price: 45,
        duration: 30
      });

      // Assert
      expect(serviceRepo.findOneBy).toHaveBeenCalledWith({
        name: 'Corte americano'
      })
      expect(serviceRepo.create).toHaveBeenCalled()
      expect(serviceRepo.save).toHaveBeenCalledWith(mockService);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockService);
    });

    it('should throw a ConflictException if the service already exists', async () => {
      serviceRepo.findOneBy.mockResolvedValue(mockService)

      await expect(service.create({
        name: 'Corte americano',
        price: 45,
        duration: 30
      })).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list', async () => {
      const qb:any = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockService], 1])
      }

      serviceRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'ASC',
      });

      expect(result.data).toHaveLength(1)
      expect(result.meta.totalItems).toBe(1)
      expect(result.meta.totalPages).toBe(1)
  });
})

  describe('findOne', () => {
    it('should return a service by ID', async () => {
      serviceRepo.findOneBy.mockResolvedValue(mockService);

      const result = await service.findOne('uuid-1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockService);
    });

    it('should throw a NotFoundException if not exist', async () => {
      serviceRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('uuid-1')).rejects.toThrow(
        NotFoundException
      )
    });
  });

  describe('update', () => {
    it('must update a service successfully', async () => {
      serviceRepo.preload.mockResolvedValue(mockService);
      serviceRepo.save.mockResolvedValue(mockService);

      const result = await service.update('uuid-1', {
        name: 'Corte degradê',
      });

      expect(serviceRepo.preload).toHaveBeenCalled()
      expect(serviceRepo.save).toHaveBeenCalled()
      expect(result.success).toBe(true);
    });

    it('should throw a NotFoundException if it cannot find', async () => {
      serviceRepo.preload.mockResolvedValue(null);

      await expect(service.update('uuid-1', {
        name: 'Corte social'
      })).rejects.toThrow(
        NotFoundException
      )
    });

    it('should throw a ConfictException for an error in the unique key', async () => {
      serviceRepo.preload.mockResolvedValue(mockService);
      serviceRepo.save.mockRejectedValue({code: '23505'});

      await expect(service.update('uuid-1', {
        name: 'Nome duplicado'
      })).rejects.toThrow(
        ConflictException
      )
    });
  });

  describe('remove', () => {
    it('must successfully remove a service', async () => {
      serviceRepo.findOneBy.mockResolvedValue(mockService);
      serviceRepo.remove.mockResolvedValue(mockService);

      const result = await service.remove('uuid-1');

      expect(serviceRepo.remove).toHaveBeenCalledWith(mockService);
      expect(result.success).toBe(true);
    });

    it('should throw a NotFoundException if the service does not found', async () => {
      serviceRepo.findOneBy.mockResolvedValue(null)

      await expect(service.remove('uuid-1')).rejects.toThrow(
        NotFoundException);
    });
  });

});