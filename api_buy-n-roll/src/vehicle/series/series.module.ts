import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLogs } from 'src/db.logs';
import { SeriesService } from './series.service';
import { SeriesController } from 'src/controllers/vehicle/series/series.controller';
import { Series } from 'src/entity/series.entity';
import { ManufacturerService } from '../manufacturer/manufacturer.service';
import { Manufacturer } from 'src/entity/manufacturer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Series]), HttpModule, TypeOrmModule.forFeature([Manufacturer])],
  providers: [SeriesService, DbLogs,ManufacturerService],
  controllers: [SeriesController],
  exports: [SeriesService, TypeOrmModule],
})
export class SeriesModule {}
