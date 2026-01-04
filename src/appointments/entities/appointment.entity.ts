import { AvaliableService } from 'src/avaliable-services/entities/avaliable-service.entity';
import { Provider } from 'src/providers/entities/provider.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Provider, { eager: true })
  provider: Provider;

  @ManyToOne(() => AvaliableService, { eager: true, onDelete: 'CASCADE' })
  service: AvaliableService;

  @Column({ type: 'timestamp' , unique: true})
  date: Date;

  @Column({ type: 'varchar', length: 100 })
  clientName: string;

  @Column({ type: 'varchar', default: 'scheduled' })
  status: AppointmentStatus;
}

export enum AppointmentStatus {
  scheduled,
  completed
}
