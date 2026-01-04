import { BlockedSlot } from 'src/schedule/entities/blocked-slot.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ unique: true, type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  workingHours: Record<
    string,
    {
      start: string;
      end: string;
    }
  >;

  @OneToMany(() => BlockedSlot, (blocked) => blocked.provider)
  blockedSlots: BlockedSlot[];
}
