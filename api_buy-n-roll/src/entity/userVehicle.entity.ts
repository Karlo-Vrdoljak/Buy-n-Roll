import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserVehicle {
  @PrimaryGeneratedColumn()
  PkUserVehicle: number;

  @OneToOne(type => User, { nullable: false })
  @JoinColumn()
  user: User;

  @Column({ nullable: false })
  Pkmanufacturer: number;

  @Column({ nullable: false })
  Pkseries: number;

  @Column({ nullable: false })
  Pkmodel: number;

  @Column({ nullable: true })
  Pkchassis: number;

  @Column({ nullable: true })
  Pkbody: number;

  @Column({ nullable: true })
  Pkcolor: number;

  @Column({ nullable: true })
  PkdriveTrain: number;

  @Column({ nullable: true })
  PkgasType: number;

  @Column({ nullable: true })
  Pktransmission: number;

  @Column({ nullable: true })
  Pktrim: number;
}
