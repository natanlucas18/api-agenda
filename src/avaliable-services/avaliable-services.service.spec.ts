import { Test, TestingModule } from '@nestjs/testing';
import { AvaliableServicesService } from './avaliable-services.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AvaliableService } from './entities/avaliable-service.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateAvaliableServiceDto } from './dto/create-avaliable-service.dto';

describe('AvaliableServicesService', () => {
  let service: AvaliableServicesService;
  let serviceRepository: Repository<AvaliableService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvaliableServicesService, {
        provide: getRepositoryToken(AvaliableService),
        useValue: {
          create: jest.fn(),
          findAll: jest.fn(),
          findOneBy: jest.fn(),
          preload: jest.fn(),
          save: jest.fn(),
          remove: jest.fn(),
        }
      }],
    }).compile();

    service = module.get<AvaliableServicesService>(AvaliableServicesService)
    serviceRepository = module.get<Repository<AvaliableService>>(getRepositoryToken(AvaliableService))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new service', async() => {
      // Arrange
      const createServiceDto: CreateAvaliableServiceDto = {
        name: 'corte degrade moicano',
        price: 35,
        duration: 30
      };
      const newService = {
        id: 'uuid',
        name: 'corte degrade moicano',
        price: 30,
        duration: 25
      }

      jest.spyOn(serviceRepository, 'create').mockReturnValue(newService);
      jest.spyOn(serviceRepository, 'save').mockResolvedValue(newService)

      // Act
      const result = await service.create(createServiceDto);

      // Assert
      expect(serviceRepository.create).toHaveBeenCalledWith({
        name: createServiceDto.name,
        price: createServiceDto.price,
        duration: createServiceDto.duration
      })
      expect(serviceRepository.save).toHaveBeenCalledWith(newService);
      expect(result).toEqual(newService);
    }) 
  })

  describe('findOne', () => {
    it('must return a service if the service is found', async () => {
    const serviceId = 'UUID example';
    const responseData = {
      id: serviceId,
      name: 'Barba',
      price: 35,
      duration: 30
    }

    jest.spyOn(serviceRepository, 'findOneBy').mockResolvedValue(responseData as any);

    const result = await service.findOne(serviceId);

    expect(result).toEqual(responseData)
  });

  it('should throw a NotFoundException if the service does not exist.', async () => {
      expect(service.findOne('hca')).rejects.toThrow(NotFoundException);
  });
  });

  describe('remove', () => {
    it('should remove a service', async () => {
      const id = 'HcA26JKL';
      const serviceExisting = {
        id: id,
        name: 'Corte Degradê',
        price: 45,
        duration: 35
      };

      jest.spyOn(serviceRepository, 'findOneBy').mockResolvedValue(serviceExisting as any);
      jest.spyOn(serviceRepository, 'remove').mockResolvedValue(serviceExisting as any);

      const result = await service.remove(id);

      expect(serviceRepository.findOneBy).toHaveBeenCalledWith({id: serviceExisting.id});
      expect(serviceRepository.remove).toHaveBeenCalledWith(serviceExisting);
      expect(result).toEqual(serviceExisting);
    });

    it('should throw a NotFoundException if the service does not found', async () => {
      jest.spyOn(serviceRepository, 'findOneBy').mockResolvedValue(null);
      await expect(service.remove('invalid')).rejects.toThrow(NotFoundException);
    });

    it('should throw a BadRequestException when delete fails.', async () => {
      const serviceExisting = {
        id: 'uuid',
        name: 'Corte Social',
        price: 30,
        duration: 25
      };

      jest.spyOn(serviceRepository, 'findOneBy').mockResolvedValue(serviceExisting as any);
      jest.spyOn(serviceRepository, 'remove').mockRejectedValue(new Error())

      await expect(service.remove(serviceExisting.id)).rejects.toThrow(BadRequestException)
    })
  })
});