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

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserVehicleModule,
    VehicleModule,
    OglasModule,
  ],
  providers: [
    UsersService,
    DbLogs,
    Config
  ],
  controllers: [UserController],
  exports: [
    UsersService,
    TypeOrmModule,
    UserVehicleModule,
    VehicleModule,
    OglasModule,
    Config
  ],
})
export class UsersModule {}
