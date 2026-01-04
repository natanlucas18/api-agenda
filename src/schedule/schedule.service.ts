import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Appointment } from "src/appointments/entities/appointment.entity";
import { AvaliableService } from "src/avaliable-services/entities/avaliable-service.entity";
import { Provider } from "src/providers/entities/provider.entity";
import { Between, Repository } from "typeorm";
import { BlockedSlot } from "./entities/blocked-slot.entity";
import { ScheduleDomain } from "./schedule.domain";
import { ResponseDto } from "src/common/dtos/response.dto";

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Provider)
    private providerRepo: Repository<Provider>,

    @InjectRepository(AvaliableService)
    private serviceRepo: Repository<AvaliableService>,

    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,

    @InjectRepository(BlockedSlot)
    private blockedRepo: Repository<BlockedSlot>
  ) { }

  async getAvailableTimes(
    providerId: string,
    serviceId: string,
    date: string
  ):Promise<string[]>{
    const domain = new ScheduleDomain();

    const provider = await this.providerRepo.findOne({
      where: { id: providerId },
    });
    if (!provider) throw new NotFoundException('Profissional não encontrado');

    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
    });
    if (!service) throw new NotFoundException('Serviço não encontrado');

    const weekDay = new Date(date)
      .toLocaleString('en-US', { weekday: 'long' })
      .toLowerCase();

    const workDay = provider.workingHours[weekDay];
    if (!workDay) return [];

    const appointments = await this.appointmentRepo.find({
      where: {
        provider: { id: providerId },
        date: Between(
          new Date(`${date}T00:00:00`),
          new Date(`${date}T23:59:59`)
        ),
      },
      relations: ['service'],
    });

    const appointmentIntervals = appointments.map(a => {
      const start = new Date(a.date);
      const end = new Date(
        start.getTime() + a.service.duration * 60000
      );
      return { start, end };
    });

    const blocked = (await this.blockedRepo.find({
      where: { provider: { id: providerId }, date },
    })).map(b => ({
      time: b.time.slice(0, 5),
      duration: b.duration > 0 ? b.duration : service.duration,
    }));

    const slots = domain.generateSlots(
      workDay.start,
      workDay.end,
      service.duration,
      service.duration
    );

    return domain.filterAvailableSlots(
      slots,
      appointmentIntervals,
      blocked,
      service.duration,
      0
    );
  }

  async blockSlot(
    providerId: string,
    date: string,
    time: string,
    duration: number,
    reason?: string
  ):Promise<ResponseDto<BlockedSlot>> {
      const blockSlot = await this.blockedRepo.save({
        provider: { id: providerId },
        date,
        time,
        duration,
        reason,
      });
      return {
        success: true,
        data: blockSlot
      }
  }

  async unblockSlot(providerId: string, date: string, time: string): Promise<ResponseDto<void>> {
       await this.blockedRepo.delete({
        provider: { id: providerId },
        date,
        time,
      });
      return {
        success: true,
      };
  }
}
