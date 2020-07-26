import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Model } from './model.entity';
import { Chassis } from './chassis.entity';

@Entity()
export class Transmission {
  @PrimaryGeneratedColumn()
  PkTransmission: number;


  @Index({fulltext:true})
  @Column({ nullable: false })
  transmissionName: string; // 'Automatic, Manual'

  @OneToMany(type => Chassis, chassis => chassis.transmission, {nullable:true})
  chassisList: Chassis[];
} 
