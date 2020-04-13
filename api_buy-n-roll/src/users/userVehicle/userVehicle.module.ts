import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLogs } from 'src/db.logs';
import { UserVehicle } from 'src/entity/userVehicle.entity';
import { UserVehicleService } from './userVehicle.service';
import { UserVehicleController } from 'src/controllers/user/userVehicle/userVehicle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserVehicle]), HttpModule],
  providers: [UserVehicleService, DbLogs],
  controllers: [UserVehicleController],
  exports: [UserVehicleService, TypeOrmModule],
})
export class UserVehicleModule {}
