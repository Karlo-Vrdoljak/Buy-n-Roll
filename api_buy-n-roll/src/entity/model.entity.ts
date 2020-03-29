import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
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

  @Column({ nullable: false })
  modelName: string; // 'F/G/H E46...' 

  @Column({ nullable: true })
  endOfProductionYear: string;

  @OneToMany(type => Drivetrain, drivetrain => drivetrain.model)
  drivetrains: Drivetrain[];

  @OneToMany(type => Trim, trim => trim.model)
  trims: Trim[];

  @OneToMany(type => Transmission, transmission => transmission.model)
  transmissions: Transmission[];

  @OneToMany(type => GasType, gasType => gasType.model)
  gasTypes: GasType[];

  @OneToMany(type => Body, body => body.model)
  bodies: Body[];

  @OneToMany(type => Chassis, chassis => chassis.model)
  chassisList: Chassis[];

  @ManyToOne(type => Series, series => series.models)
  series: Series;
} 
