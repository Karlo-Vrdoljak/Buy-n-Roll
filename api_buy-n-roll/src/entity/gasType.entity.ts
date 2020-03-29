import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Model } from './model.entity';

@Entity()
export class GasType {
  @PrimaryGeneratedColumn()
  PkGasType: number;

  @Column({ nullable: false })
  gasType: string; // 'benzinac, dizelas, lpg'

  @ManyToOne(type => Model, model => model.drivetrains)
  model: Model;
} 
