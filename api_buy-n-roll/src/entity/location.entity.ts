import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

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
  
}
