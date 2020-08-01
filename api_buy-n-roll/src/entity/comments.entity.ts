import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne, CreateDateColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { User } from './user.entity';
import { Chassis } from './chassis.entity';
import { Oglas } from './oglas.entity';

@Entity()
@Tree("materialized-path")
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @TreeChildren()
  children: Comments[];

  @TreeParent()
  parent: Comments;

  @ManyToOne(type => User, { nullable: false })
  user: User;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(type => Oglas, { nullable: false})
  oglas: Oglas;

  @CreateDateColumn()
  createdAt:Date;

  @Column({ nullable: true })
  comment: string;

}
