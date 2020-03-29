import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLogs } from 'src/db.logs';
import { Transmission } from 'src/entity/transmission.entity';
import { TransmissionService } from './transmission.service';
import { TransmissionController } from 'src/controllers/vehicle/transmission/series.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transmission]), HttpModule],
  providers: [TransmissionService, DbLogs],
  controllers: [TransmissionController],
  exports: [TransmissionService, TypeOrmModule],
})
export class TransmissionModule {}
