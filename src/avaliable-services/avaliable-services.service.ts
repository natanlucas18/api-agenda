import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAvaliableServiceDto } from './dto/create-avaliable-service.dto';
import { UpdateAvaliableServiceDto } from './dto/update-avaliable-service.dto';
import { AvaliableService } from './entities/avaliable-service.entity';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';

@Injectable()
export class AvaliableServicesService {
  constructor(
    @InjectRepository(AvaliableService)
    private readonly avaliableServiceRepo: Repository<AvaliableService>,
  ) {}
  async create(createAvaliableServiceDto: CreateAvaliableServiceDto): Promise<ResponseDto<AvaliableService>> {
    const exists = await this.avaliableServiceRepo.findOneBy({
      name: createAvaliableServiceDto.name,
    });
    if (exists) {
      throw new ConflictException('Esse serviço já existe!');
    }
    const service = this.avaliableServiceRepo.create({
      name: createAvaliableServiceDto.name,
      price: createAvaliableServiceDto.price,
      duration: createAvaliableServiceDto.duration,
    });
      await this.avaliableServiceRepo.save(service);
      return {
        success: true,
        data: service
      }
  }

  async findAll(query: PaginationQueryDto ):Promise<PaginatedResponseDto<AvaliableService>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const qb = this.avaliableServiceRepo.createQueryBuilder('service');

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

  async findOne(id: string):Promise<ResponseDto<AvaliableService>> {
    const service = await this.avaliableServiceRepo.findOneBy({
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
    updateAvaliableServiceDto: UpdateAvaliableServiceDto,
  ):Promise<ResponseDto<AvaliableService>> {
    const service = await this.avaliableServiceRepo.preload({
      id,
      ...updateAvaliableServiceDto,
    });
    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }
    try {
      await this.avaliableServiceRepo.save(service);
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

  async remove(id: string):Promise<ResponseDto<AvaliableService>> {
    const service = await this.avaliableServiceRepo.findOneBy({
      id,
    });
    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }
      await this.avaliableServiceRepo.remove(service);
      return {
        success: true,
        data: service
      }
  }
}
