import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  PkRole: number;

  @Column()
  name: string;

  @ManyToOne(type => User, user => user.roles)
  user: User;
}