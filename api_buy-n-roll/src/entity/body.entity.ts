import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Model } from './model.entity';

@Entity()
export class Body {
  @PrimaryGeneratedColumn()
  PkBody: number;

  @Column({ nullable: false })
  BodyName: string; // 'sedan, hatchback, limuzina'

} 
