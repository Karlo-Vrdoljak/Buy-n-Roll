import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Model } from './model.entity';

@Entity()
export class Drivetrain {
  @PrimaryGeneratedColumn()
  PkDrivetrain: number;

  @Column({ nullable: false })
  drivetrainName: string; // 'Front wheel drive'

  @Column({ nullable: false })
  drivetrainCode: string; // 'FWD | AWD | RWD' 

  @ManyToOne(type => Model, model => model.drivetrains)
  model: Model;
} 
