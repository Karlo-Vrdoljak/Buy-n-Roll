import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Model } from './model.entity';

@Entity()
export class Trim {
  @PrimaryGeneratedColumn()
  PkTrim: number;

  @Index({fulltext:true})
  @Column({ nullable: true })
  trimName: string; // 'GLS, GSi'

  @Column({ nullable: true })
  trimCode: string; // 'FWD | AWD | RWD' 

  @ManyToOne(type => Model, model => model.drivetrains)
  model: Model;
} 
