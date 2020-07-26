import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Chassis } from './chassis.entity';
import { Manufacturer } from './manufacturer.entity';
import { Drivetrain } from './drivetrain.entity';
import { Transmission } from './transmission.entity';
import { GasType } from './gasType.entity';
import { Body } from './body.entity';
import { Series } from './series.entity';

@Entity()
export class Model {
  @PrimaryGeneratedColumn()
  PkModel: number;
  
  @Index({fulltext:true})
  @Column({ nullable: false })
  modelName: string; // 'F/G/H E46...' 

  @Column({ nullable: true })
  endOfProductionYear: string;

  @ManyToOne(type => Series, series => series.models)
  series: Series;
} 
