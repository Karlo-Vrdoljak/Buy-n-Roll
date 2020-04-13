import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Model } from './model.entity';

@Entity()
export class Body {
  @PrimaryGeneratedColumn()
  PkBody: number;
  
  @Index({fulltext:true})
  @Column({ nullable: false })
  BodyName: string; // 'sedan, hatchback, limuzina'

} 
