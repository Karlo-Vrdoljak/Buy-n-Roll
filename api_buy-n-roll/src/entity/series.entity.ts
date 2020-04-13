import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Chassis } from './chassis.entity';
import { Manufacturer } from './manufacturer.entity';
import { Model } from './model.entity';

@Entity()
export class Series {
  @PrimaryGeneratedColumn()
  PkSeries: number;
  
  @Index({fulltext:true})
  @Column({ nullable: true })
  seriesName: string; // 'astra' 

  @ManyToOne(type => Manufacturer, manufacturer => manufacturer.series)
  manufacturer: Manufacturer;

  @OneToMany(type => Model, model => model.series)
  models: Model[];
} 
