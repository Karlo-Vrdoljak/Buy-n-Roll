import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  firstName: string;

  @Column()
  password: string;

  @Column()
  lastName: string;

  @Column({unique:true})
  username: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(type => Role, role => role.user)
  roles: Role[];
}