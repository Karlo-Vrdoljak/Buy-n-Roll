import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Role } from './role.entity';
import { Oglas } from './oglas.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({generated:"uuid"})
  userCode:string;

  @CreateDateColumn()
  createdAt:Date;

  @OneToMany(type => Role, role => role.user)
  roles: Role[];

}