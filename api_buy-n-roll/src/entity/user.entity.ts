import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from './role.entity';
import { Location } from './location.entity';
import { SellerType } from 'src/types/enums';
import { Photo } from './photo.entity';
import { UserVehicle } from './userVehicle.entity';
import { Favourites } from './favourites.entity';


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

  @Column({ default: false })
  isActive: boolean;

  @Column({generated:"uuid", select: false})
  userCode:string;

  @CreateDateColumn()
  createdAt:Date;

  @OneToMany(type => Role, role => role.user)
  roles: Role[];

  @Column({ type: "enum",enum: SellerType,default: SellerType.PRIVATNA_OSOBA })
  sellerType:SellerType;

  @ManyToOne(type => Location, {nullable:true})
  location: Location;

  @OneToMany(type => UserVehicle, UserVehicle => UserVehicle.user)
  vehicles: UserVehicle[];

  @OneToOne(type => Photo, {nullable:true})
  @JoinColumn()
  photo: Photo;

  @OneToMany(type => Favourites, favourites => favourites.user)
  favourites: Favourites[];

}