import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AvaliableService {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', unique: true })
  name: string;
  @Column({ type: 'decimal' })
  price: number;
  @Column({ type: 'int' })
  duration: number;
}
