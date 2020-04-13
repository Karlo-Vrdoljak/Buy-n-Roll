import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserController } from 'src/controllers/user/user.controller';
import { DbLogs } from 'src/db.logs';
import { UserVehicleModule } from './userVehicle/userVehicle.module';
import { VehicleModule } from 'src/vehicle/vehicle.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserVehicleModule, VehicleModule],
  providers: [UsersService, DbLogs],
  controllers: [UserController],
  exports: [UsersService, TypeOrmModule, UserVehicleModule, VehicleModule],
})
export class UsersModule {}
