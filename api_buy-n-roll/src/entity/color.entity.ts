import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Color {
  @PrimaryGeneratedColumn()
  PkColor: number;

  @Column({ nullable: true })
  colorCode: string; // z20r etc

  @Column({ nullable: false })
  color: string; // blue, red, black...

}
