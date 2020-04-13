import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Model } from './model.entity';
import { Manufacturer } from './manufacturer.entity';
import { Series } from './series.entity';
import { Chassis } from './chassis.entity';
import { Body } from './body.entity';
import { Color } from './color.entity';
import { Drivetrain } from './drivetrain.entity';
import { GasType } from './gasType.entity';
import { Transmission } from './transmission.entity';
import { Trim } from './trim.entity';
import { User } from './user.entity';

@Entity()
export class UserVehicle {
  @PrimaryGeneratedColumn()
  PkUserVehicle: number;

  @OneToOne(type => User, { nullable: false })
  @JoinColumn()
  user: User;

  @OneToOne(type => Manufacturer, { nullable: false })
  @JoinColumn()
  manufacturer: Manufacturer;

  @OneToOne(type => Series, { nullable: false })
  @JoinColumn()
  series: Series;

  @OneToOne(type => Model, { nullable: false })
  @JoinColumn()
  model: Model;

  @OneToOne(type => Chassis, { nullable: true })
  @JoinColumn()
  chassis: Chassis;

  @OneToOne(type => Body, { nullable: true })
  @JoinColumn()
  body: Body;

  @OneToOne(type => Color, { nullable: true })
  @JoinColumn()
  color: Color;

  @OneToOne(type => Drivetrain, { nullable: true })
  @JoinColumn()
  driveTrain: Drivetrain;

  @OneToOne(type => GasType, { nullable: true })
  @JoinColumn()
  gasType: GasType;

  @OneToOne(type => Transmission, { nullable: true })
  @JoinColumn()
  transmission: Transmission;

  @OneToOne(type => Trim, { nullable: true })
  @JoinColumn()
  trim: Trim;
}
