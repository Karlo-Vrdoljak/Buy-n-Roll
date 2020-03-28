import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Color } from './color.entity';

@Entity()
export class Chassis {
  @PrimaryGeneratedColumn()
  PkChassis: number;

  @Column({ nullable: true })
  makeYear: string; 

  @Column({ nullable: true, unique:true })
  VIN: string;

  @Column({ nullable: false, default:false })
  RegistriranDaNe: boolean;

  @OneToOne(type => Color)
  @JoinColumn()
  color: Color;

}
