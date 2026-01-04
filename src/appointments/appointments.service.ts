import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ){}

  async create(createAppointmentDto: Partial<Appointment>):Promise<ResponseDto<Appointment>> {
    const isExists = await this.appointmentRepo.findOne({
      where: {date: createAppointmentDto.date}
    })

    if(isExists) {
      throw new ConflictException('Já existe um agendamento nesse horário')
    }
    const appointment = this.appointmentRepo.create(createAppointmentDto);
    await this.appointmentRepo.save(appointment);
    return {
      success: true,
      data: appointment,
    }
  }

  async findAll(query: AppointmentQueryDto):Promise<PaginatedResponseDto<Appointment>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const qb = this.appointmentRepo.createQueryBuilder('appointment')

    if (query.search) {
      qb.andWhere('(appointment.clientName ILIKE :search)', {
        search: `%${query.search}%`,
      });
    };

    qb.orderBy(`appointment.${query.sortBy}`, query.sortOrder);

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
    };
  }

  async findOne(id: string):Promise<ResponseDto<Appointment>> {
    const appointment = await this.appointmentRepo.findOneBy({
      id,
    });
    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }
    return {
      success: true,
      data: appointment
    }
  }
  async remove(id: string):Promise<ResponseDto<Appointment>> {
    const appointment = await this.appointmentRepo.findOneBy({
      id,
    });
    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }
    await this.appointmentRepo.delete(appointment);
    return {
      success: true,
      data: appointment
    }
  }
}
