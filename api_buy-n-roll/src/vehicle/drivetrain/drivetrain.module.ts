import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLogs } from 'src/db.logs';
import { Drivetrain } from 'src/entity/drivetrain.entity';
import { DrivetrainService } from './drivetrain.service';
import { DrivetrainController } from 'src/controllers/vehicle/drivetrain/drivetrain.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Drivetrain]), HttpModule],
  providers: [DrivetrainService, DbLogs],
  controllers: [DrivetrainController],
  exports: [DrivetrainService, TypeOrmModule],
})
export class DrivetrainModule {}
