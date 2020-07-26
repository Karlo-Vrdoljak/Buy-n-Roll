import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Oglas } from './oglas.entity';
import { User } from './user.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  PkLocation: number;

  @Column({ nullable: false })
  place_id: string;

  @Column("simple-array", { nullable: true })
  boundingbox:string[]; // geografske jedinice 

  @Column({ nullable: true, default:false })
  lat: string;

  @Column({ nullable: true, default:false })
  lon: string;

  @Column({ nullable: true, default:false })
  display_name: string;

  @Column({ nullable: true, default:'place' })
  class:string; // klasifikacija lokacije
  
  @Column({ nullable: true, default:'house' })
  type:string // tip adrese

  @OneToMany(type => Oglas, oglas => oglas.location)
  oglasi: Oglas[];
  
  @OneToMany(type => User, user => user.location)
  users: User[];
  
}
