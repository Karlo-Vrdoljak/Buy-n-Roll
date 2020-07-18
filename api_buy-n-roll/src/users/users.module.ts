import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserController } from 'src/controllers/user/user.controller';
import { DbLogs } from 'src/db.logs';
import { UserVehicleModule } from './userVehicle/userVehicle.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { OglasModule } from './oglas/oglas.module';
import { Config } from 'src/config';
import { RolesModule } from 'src/roles/roles.module';
import { LocationModule } from './location/location.module';
import { PhotoModule } from './oglas/photo/photo.module';
import { AppService } from 'src/app.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserVehicleModule,
    VehicleModule,
    OglasModule,
    RolesModule,
    LocationModule,
    PhotoModule,
  ],
  providers: [
    UsersService,
    DbLogs,
    Config,
    AppService
  ],
  controllers: [UserController],
  exports: [
    UsersService,
    TypeOrmModule,
    UserVehicleModule,
    VehicleModule,
    OglasModule,
    RolesModule,
    Config,
    LocationModule,
    PhotoModule,

  ],
})
export class UsersModule {}
