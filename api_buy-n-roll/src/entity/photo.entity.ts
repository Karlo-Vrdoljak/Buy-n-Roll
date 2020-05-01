import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, Index, CreateDateColumn } from 'typeorm';
import { Model } from './model.entity';
import { User } from './user.entity';
import { Oglas } from './oglas.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  PkPhoto: number;

  @Index({fulltext:true})
  @Column({ nullable: true })
  photoTitle: string; // 'Astra f gsi prvi vlasnik'

  @Column({ nullable: true })
  photoOpis: string; // 'free text opis' 

  @CreateDateColumn()
  photoCreatedAt:Date;

  @ManyToOne(type => Oglas, oglas => oglas.photos)
  oglas: Oglas;


} 
