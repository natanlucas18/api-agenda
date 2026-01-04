import { Provider } from "src/providers/entities/provider.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity('blocked_slots')
@Unique(['provider', 'time'])
export class BlockedSlot{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'date'})
    date: string;

    @Column({type: 'time'})
    time: string;

    @Column({type: 'int', default: 0})
    duration: number;

    @Column({type: 'text', nullable: true})
    reason?: string;

    @ManyToOne(() => Provider, (provider) => provider.blockedSlots, { onDelete: 'CASCADE'})
    provider: Provider;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
