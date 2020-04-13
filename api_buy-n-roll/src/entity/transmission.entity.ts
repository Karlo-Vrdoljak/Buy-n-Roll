import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Model } from './model.entity';

@Entity()
export class Transmission {
  @PrimaryGeneratedColumn()
  PkTransmission: number;


  @Index({fulltext:true})
  @Column({ nullable: false })
  transmissionName: string; // 'Automatic, Manual'

} 
