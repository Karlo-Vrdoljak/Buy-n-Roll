import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Chassis } from './chassis.entity';

@Entity()
export class UserVehicle {
  @PrimaryGeneratedColumn()
  PkUserVehicle: number;

  @OneToOne(type => User, { nullable: false })
  @JoinColumn()
  user: User;

  @OneToOne(type => Chassis, { nullable: false })
  @JoinColumn()
  chassis: Chassis;

  @Column({ nullable: false, default:false })
  RegistriranDaNe: boolean;

}
