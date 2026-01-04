import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { Provider } from './entities/provider.entity';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}
  async create(createProviderDto: CreateProviderDto):Promise<ResponseDto<Provider>> {
    const isExists = await this.providerRepository.findOneBy({
      name: createProviderDto.name,
    });
    if (isExists) {
      throw new ConflictException('Provider all exists.');
    }
    const provider = this.providerRepository.create({
      name: createProviderDto.name,
      workingHours: createProviderDto.workingHours
    });
      await this.providerRepository.save(provider);
      return {
        success: true,
        data: provider
      }
  }

  async findAll(query: PaginationQueryDto):Promise<PaginatedResponseDto<Provider>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10; 
    const skip = (page - 1) * limit;

    const qb = this.providerRepository.createQueryBuilder('provider');

    if (query.search) {
      qb.andWhere('(provider.name ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }
    qb.orderBy(`provider.${query.sortBy}`, query.sortOrder);
    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

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


  async findOne(id: string):Promise<ResponseDto<Provider>> {
    const provider = await this.providerRepository.findOneBy({
      id,
    });
    if (!provider) {
      throw new NotFoundException('Profissional não encontrado');
    }
    return {
      success: true,
      data: provider
    }
}

  async update(id: string, updateProviderDto: UpdateProviderDto):Promise<ResponseDto<Provider>> {
    const provider = await this.providerRepository.preload({
      id,
      ...updateProviderDto,
    });
    if (!provider) {
      throw new NotFoundException('Profissional não encontrado');
    }
    try{
       await this.providerRepository.save(provider);
       return {
        success: true,
        data: provider,
       }
    } catch(error) {
      if(error.code === '23505') {
        throw new ConflictException('Nome inválido! já existe um profissional com esse nome')
      }
      throw new error(error)
    }
  }

  async remove(id: string):Promise<ResponseDto<Provider>> {
    const provider = await this.providerRepository.findOneBy({
      id,
    });
    if (!provider) {
      throw new NotFoundException('Profissional não encontrado');
    }
      await this.providerRepository.delete(provider);
      return {
        success: true,
        data:provider
      }
  }
}
