import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Model } from './model.entity';
import { User } from './user.entity';
import { Photo } from './photo.entity';
import { UserVehicle } from './userVehicle.entity';
import { PaymentMethod } from 'src/types/enums';


@Entity()
export class Oglas {
  @PrimaryGeneratedColumn()
  PkOglas: number;

  @Index({fulltext:true})
  @Column({ nullable: true })
  oglasNaziv: string; // 'Astra f gsi prvi vlasnik'

  @Index({fulltext:true})
  @Column({ nullable: true, length: 2048 })
  oglasOpis: string; // 'free text opis' 

  @CreateDateColumn()
  oglasCreatedAt:Date;

  @UpdateDateColumn()
  lastModified:Date;

  @OneToMany(type => Photo, photo => photo.oglas)
  photos: Photo[];

  @OneToOne(type => UserVehicle, {nullable:true})
  @JoinColumn()
  vehicle: UserVehicle;

  @Column({default: 0})
  rating:number;

  @Column({default:0})
  views:number;

  @Column({default:'0'})
  priceMainCurrency:string; // kune

  @Column({default:'0'})
  priceSubCurrency:string; // lipe
  
  @Column({ type: "enum",enum: PaymentMethod,default: PaymentMethod.GOTOVINA })
  paymentMethod:PaymentMethod;

  @Column("simple-array", { nullable: true })
  autoRadioDefs:string[]; // tip radija, stagod

  @Column("simple-array", { nullable: true })
  safety:string[]; // abs, zracni jastuci itd

  @Column("simple-array", { nullable: true })
  accessories:string[];  //dodatna oprema, putno racunalo, rezervno kolo, 3. štop, alu felge itd

  @Column("simple-array", { nullable: true })
  theftSafety:string[]; //alarm, zakljucavanje volana itd

  @Column("simple-array", { nullable: true })
  airConditioning:string[]; // karakteristike klime

  @Column("simple-array", { nullable: true })
  comfortAccessories:string[];  //podizaci stakala, grijaci siceva itd, senzori razni
} 
