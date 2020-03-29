import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Model } from './model.entity';

@Entity()
export class Transmission {
  @PrimaryGeneratedColumn()
  PkTransmission: number;

  @Column({ nullable: false })
  transmissionName: string; // 'Automatic, Manual'

  @ManyToOne(type => Model, model => model.drivetrains)
  model: Model;
} 
