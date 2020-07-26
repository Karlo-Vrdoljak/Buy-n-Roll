import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Model } from './model.entity';
import { Chassis } from './chassis.entity';

@Entity()
export class GasType {
  @PrimaryGeneratedColumn()
  PkGasType: number;

  @Index({fulltext:true})
  @Column({ nullable: false })
  gasType: string; // 'benzinac, dizelas, lpg'

  @OneToMany(type => Chassis, chassis => chassis.gasType, {nullable:true})
  chassisList: Chassis[];

} 
