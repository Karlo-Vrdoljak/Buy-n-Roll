import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Model } from './model.entity';
import { Chassis } from './chassis.entity';

@Entity()
export class Body {
  @PrimaryGeneratedColumn()
  PkBody: number;
  
  @Index({fulltext:true})
  @Column({ nullable: false })
  bodyName: string; // 'sedan, hatchback, limuzina'

  @OneToMany(type => Chassis, chassis => chassis.body, {nullable:true})
  chassisList: Chassis[];
} 
