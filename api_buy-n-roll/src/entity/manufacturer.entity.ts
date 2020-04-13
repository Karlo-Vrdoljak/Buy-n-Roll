import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { User } from './user.entity';
import { Series } from './series.entity';

@Entity()
export class Manufacturer {
  @PrimaryGeneratedColumn()
  PkManufacturer: number;

  @Index({fulltext:true})
  @Column()
  manufacturerName: string;

  @OneToMany(type => Series, series => series.manufacturer)
  series: Series[];
}