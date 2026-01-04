import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';
import { AvailableService } from './entities/available-service.entity';
import { CreateAvailableServiceDto } from './dto/create-available-service.dto';
import { UpdateAvailableServiceDto } from './dto/update-available-service.dto';

@Injectable()
export class AvailableServicesService {
  constructor(
    @InjectRepository(AvailableService)
    private readonly availableServiceRepo: Repository<AvailableService>,
  ) {}
  async create(createAvailableServiceDto: CreateAvailableServiceDto): Promise<ResponseDto<AvailableService>> {
    const exists = await this.availableServiceRepo.findOneBy({
      name: createAvailableServiceDto.name,
    });
    if (exists) {
      throw new ConflictException('Esse serviço já existe!');
    }
    const service = this.availableServiceRepo.create({
      name: createAvailableServiceDto.name,
      price: createAvailableServiceDto.price,
      duration: createAvailableServiceDto.duration,
    });
      await this.availableServiceRepo.save(service);
      return {
        success: true,
        data: service
      }
  }

  async findAll(query: PaginationQueryDto ):Promise<PaginatedResponseDto<AvailableService>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const qb = this.availableServiceRepo.createQueryBuilder('service');

    if (query.search) {
      qb.andWhere('(service.name ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    qb.orderBy(`service.${query.sortBy}`, query.sortOrder);

    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    const totalPages = Math.ceil(total / limit)
    return {
      data,
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages
      }
    }
  }

  async findOne(id: string):Promise<ResponseDto<AvailableService>> {
    const service = await this.availableServiceRepo.findOneBy({
      id,
    });
    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }
    return {
      success: true,
      data: service
    };
  }

  async update(
    id: string,
    updateAvailableServiceDto: UpdateAvailableServiceDto,
  ):Promise<ResponseDto<AvailableService>> {
    const service = await this.availableServiceRepo.preload({
      id,
      ...updateAvailableServiceDto,
    });
    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }
    try {
      await this.availableServiceRepo.save(service);
      return {
        success: true,
        data: service
      }
    } catch(error) {
      if(error.code === '23505') {
        throw new ConflictException('Já existe um serviço com esse nome')
      }
      throw new Error(error)
    }
  }

  async remove(id: string):Promise<ResponseDto<AvailableService>> {
    const service = await this.availableServiceRepo.findOneBy({
      id,
    });
    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }
      await this.availableServiceRepo.remove(service);
      return {
        success: true,
        data: service
      }
  }
}
