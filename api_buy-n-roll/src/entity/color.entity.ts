import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Chassis } from './chassis.entity';

@Entity()
export class Color {
  @PrimaryGeneratedColumn()
  PkColor: number;

  @Column({ nullable: true })
  colorCode: string; // z20r etc

  @Index({fulltext:true})
  @Column({ nullable: false })
  color: string; // blue, red, black...

  @OneToMany(type => Chassis, chassis => chassis.color, {nullable:true})
  chassisList: Chassis[];

}
