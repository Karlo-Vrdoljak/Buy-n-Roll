import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Model } from './model.entity';
import { Chassis } from './chassis.entity';

@Entity()
export class Drivetrain {
  @PrimaryGeneratedColumn()
  PkDrivetrain: number;
  
  @Index({fulltext:true})
  @Column({ nullable: false })
  drivetrainCode: string; // 'FWD | AWD | RWD' 

  @OneToMany(type => Chassis, chassis => chassis.drivetrain, {nullable:true})
  chassisList: Chassis[];
} 
