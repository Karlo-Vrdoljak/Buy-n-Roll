import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Color } from './color.entity';
import { Model } from './model.entity';
import { VehicleState } from 'src/types/enums';
import { Drivetrain } from './drivetrain.entity';
import { Transmission } from './transmission.entity';
import { GasType } from './gasType.entity';
import { Body } from './body.entity';

@Entity()
export class Chassis {
  @PrimaryGeneratedColumn()
  PkChassis: number;

  @Column({ nullable: true })
  makeYear: string; 

  @Column({ nullable: true, unique:true })
  VIN: string;

  @ManyToOne(type => Color, color => color.chassisList)
  color: Color;

  @OneToOne(type => Drivetrain, {nullable:true})
  @JoinColumn()
  drivetrain: Drivetrain;

  @OneToOne(type => Transmission, {nullable:true})
  @JoinColumn()
  transmission: Transmission;
 
  @OneToOne(type => GasType, {nullable:true})
  @JoinColumn()
  gasType: GasType;

  @OneToOne(type => Body, {nullable:true})
  @JoinColumn()
  body: Body;

  @OneToOne(type => Model, {nullable:true})
  @JoinColumn()
  model: Model;

  @Column({ default: '0' })
  kilometers: string;

  @Column({type: "enum",enum: VehicleState,default: VehicleState.DOBRO})
  vehicleState: VehicleState;

  @Column({ nullable: true })
  consumption:number;

}
