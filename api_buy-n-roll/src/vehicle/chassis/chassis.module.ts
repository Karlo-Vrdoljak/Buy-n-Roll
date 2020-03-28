import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLogs } from 'src/db.logs';
import { Chassis } from 'src/entity/chassis.entity';
import { ChassisController } from 'src/controllers/vehicle/chassis/chassis.controller';
import { ChassisService } from './chassis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chassis]), HttpModule],
  providers: [ChassisService, DbLogs],
  controllers: [ChassisController],
  exports: [ChassisService, TypeOrmModule],
})
export class ChassisModule {}
