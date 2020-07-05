import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Role } from './role.entity';
import { SellerType } from 'src/types/enums';


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

  @Column({ nullable: true, default: null })
  phone: string;

  @Column({ nullable: true, default: null })
  email: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({generated:"uuid", select: false})
  userCode:string;

  @CreateDateColumn()
  createdAt:Date;

  @OneToMany(type => Role, role => role.user)
  roles: Role[];

  @Column({ type: "enum",enum: SellerType,default: SellerType.PRIVATNA_OSOBA })
  sellerType:SellerType;

}