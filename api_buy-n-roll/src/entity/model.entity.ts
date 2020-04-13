import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Chassis } from './chassis.entity';
import { Manufacturer } from './manufacturer.entity';
import { Drivetrain } from './drivetrain.entity';
import { Trim } from './trim.entity';
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

  @OneToMany(type => Drivetrain, drivetrain => drivetrain.model, {nullable:true})
  drivetrains: Drivetrain[];

  @OneToMany(type => Trim, trim => trim.model, {nullable:true})
  trims: Trim[];


  @OneToOne(type => Transmission, {nullable:true})
  @JoinColumn()
  transmission: Transmission;
 
  @OneToOne(type => GasType, {nullable:true})
  @JoinColumn()
  gasType: string;

  @OneToOne(type => Body, {nullable:true})
  @JoinColumn()
  body: Body;

  @OneToMany(type => Chassis, chassis => chassis.model, {nullable:true})
  chassisList: Chassis[];

  @ManyToOne(type => Series, series => series.models)
  series: Series;
} 
