import { IsEmail } from 'class-validator';
import { Roles } from 'src/auth/enum/roles';
import { Column, CreateDateColumn, Entity, Generated } from 'typeorm';

@Entity()
export class User {
  @Generated('increment')
  @Column({ primary: true })
  id: number;

  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'simple-array', default: ['user'] })
  roles: Roles[];
}
