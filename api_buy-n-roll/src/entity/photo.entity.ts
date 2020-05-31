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
  photoTitle: string;

  @Column({ nullable: true })
  photoOpis: string;

  @CreateDateColumn()
  photoCreatedAt:Date;

  @ManyToOne(type => Oglas, oglas => oglas.photos)
  oglas: Oglas;

  @Column({ nullable: true })
  fieldname: string;

  @Column({ nullable: true })
  originalname: string;

  @Column({ nullable: true })
  encoding: string;

  @Column({ nullable: true })
  mimetype: string;

  @Column({ nullable: true })
  destination: string;

  @Column({ nullable: true })
  filename: string;

  @Column({ nullable: true })
  path: string;

  @Column({ nullable: true })
  size: string;

} 
