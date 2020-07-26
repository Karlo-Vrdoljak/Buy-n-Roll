import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Chassis } from './chassis.entity';
import { Oglas } from './oglas.entity';

@Entity()
export class UserVehicle {
  @PrimaryGeneratedColumn()
  PkUserVehicle: number;

  @ManyToOne(type => User, { nullable: false })
  user: User;

  @ManyToOne(type => Chassis, { nullable: false })
  chassis: Chassis;

  @Column({ nullable: false, default:false })
  RegistriranDaNe: boolean;

  @OneToMany(type => Oglas, oglas => oglas.vehicle)
  oglasi: Oglas[];

}
