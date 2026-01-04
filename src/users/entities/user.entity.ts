import { IsEmail } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  name: string;

  @Column({ unique: true, nullable: true })
  @IsEmail()
  email: string;

  @Column({ length: 255, nullable: true })
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'jsonb', default: () => '\'["user"]\'' })
  roles: string[];
}
