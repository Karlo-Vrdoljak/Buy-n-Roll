import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Color } from './color.entity';
import { Model } from './model.entity';
import { VehicleState } from 'src/types/enums';

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


  @ManyToOne(type => Model, model => model.chassisList)
  model: Model;

  @Column({ default: '0' })
  kilometers: string;

  @Column({type: "enum",enum: VehicleState,default: VehicleState.DOBRO})
  vehicleState: VehicleState;

  @Column({ nullable: true })
  consumption:number;

}
