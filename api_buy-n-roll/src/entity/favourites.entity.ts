import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Chassis } from './chassis.entity';
import { Oglas } from './oglas.entity';

@Entity()
export class Favourites {
  @PrimaryGeneratedColumn()
  PkFavourite: number;

  @ManyToOne(type => User, { nullable: false })
  user: User;

  @ManyToOne(type => Oglas, { nullable: false })
  oglas: Oglas;

  @CreateDateColumn()
  createdAt:Date;

}
