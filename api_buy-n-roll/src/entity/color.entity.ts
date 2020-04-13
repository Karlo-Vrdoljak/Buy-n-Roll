import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';

@Entity()
export class Color {
  @PrimaryGeneratedColumn()
  PkColor: number;

  @Column({ nullable: true })
  colorCode: string; // z20r etc

  @Index({fulltext:true})
  @Column({ nullable: false })
  color: string; // blue, red, black...

}
