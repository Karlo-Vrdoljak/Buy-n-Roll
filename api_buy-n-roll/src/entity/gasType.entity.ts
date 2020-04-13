import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Model } from './model.entity';

@Entity()
export class GasType {
  @PrimaryGeneratedColumn()
  PkGasType: number;

  @Index({fulltext:true})
  @Column({ nullable: false })
  gasType: string; // 'benzinac, dizelas, lpg'

} 
