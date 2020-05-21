import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLogs } from 'src/db.logs';
import { Model } from 'src/entity/model.entity';
import { ModelService } from './model.service';
import { ModelController } from 'src/controllers/vehicle/model/model.controller';
import { Series } from 'src/entity/series.entity';
import { SeriesService } from '../series/series.service';

@Module({
  imports: [TypeOrmModule.forFeature([Model]), HttpModule,TypeOrmModule.forFeature([Series])],
  providers: [ModelService, DbLogs, SeriesService],
  controllers: [ModelController],
  exports: [ModelService, TypeOrmModule],
})
export class ModelModule {}
