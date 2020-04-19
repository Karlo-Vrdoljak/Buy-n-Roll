import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Color } from './color.entity';
import { Model } from './model.entity';

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

}
