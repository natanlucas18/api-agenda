import { AvailableService } from 'src/available-services/entities/available-service.entity';
import { Provider } from 'src/providers/entities/provider.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Provider, { eager: true })
  provider: Provider;

  @ManyToOne(() => AvailableService, { eager: true, onDelete: 'CASCADE' })
  service: AvailableService;

  @Column({ type: 'timestamp' , unique: true})
  date: Date;

  @Column({ type: 'varchar', length: 100 })
  clientName: string;

  @Column({ type: 'varchar', default: 'scheduled' })
  status: AppointmentStatus;
}

export enum AppointmentStatus {
  scheduled,
  finished
}
