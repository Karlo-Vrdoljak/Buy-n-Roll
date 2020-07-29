import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Color } from './color.entity';
import { Model } from './model.entity';
import { VehicleState } from 'src/types/enums';
import { Drivetrain } from './drivetrain.entity';
import { Transmission } from './transmission.entity';
import { GasType } from './gasType.entity';
import { Body } from './body.entity';
import { UserVehicle } from './userVehicle.entity';

@Entity()
export class Chassis {
  @PrimaryGeneratedColumn()
  PkChassis: number;

  @Column({ nullable: true })
  makeYear: string; 

  @Column({ nullable: true })
  VIN: string;

  @ManyToOne(type => Color, color => color.chassisList)
  color: Color;

  @ManyToOne(type => Drivetrain, {nullable:true})
  drivetrain: Drivetrain;

  @ManyToOne(type => Transmission, {nullable:true})
  transmission: Transmission;
 
  @ManyToOne(type => GasType, {nullable:true})
  gasType: GasType;

  @ManyToOne(type => Body, {nullable:true})
  body: Body;

  @ManyToOne(type => Model, {nullable:true})
  model: Model;

  
  @OneToMany(type => UserVehicle, UserVehicle => UserVehicle.chassis)
  vehicles: UserVehicle[];

  @Column({ default: '0' })
  kilometers: string;

  @Column({type: "enum",enum: VehicleState,default: VehicleState.DOBRO})
  vehicleState: VehicleState;

  @Column({ nullable: true })
  consumption:number;

}
