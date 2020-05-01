import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, Index, CreateDateColumn } from 'typeorm';
import { Model } from './model.entity';
import { User } from './user.entity';
import { Photo } from './photo.entity';
import { UserVehicle } from './userVehicle.entity';

@Entity()
export class Oglas {
  @PrimaryGeneratedColumn()
  PkOglas: number;

  @Index({fulltext:true})
  @Column({ nullable: true })
  oglasNaziv: string; // 'Astra f gsi prvi vlasnik'

  @Index({fulltext:true})
  @Column({ nullable: true, length: 2048 })
  oglasOpis: string; // 'free text opis' 

  @CreateDateColumn()
  oglasCreatedAt:Date;

  @OneToMany(type => Photo, photo => photo.oglas)
  photos: Photo[];

  @OneToOne(type => UserVehicle, {nullable:true})
  @JoinColumn()
  vehicle: UserVehicle;
} 
