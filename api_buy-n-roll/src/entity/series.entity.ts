import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Chassis } from './chassis.entity';

@Entity()
export class Series {
  @PrimaryGeneratedColumn()
  PkSeries: number;

  @Column({ nullable: false })
  name: string; // 'astra' 

  @OneToOne(type => Chassis)
  @JoinColumn()
  chassis: Chassis;

} 
