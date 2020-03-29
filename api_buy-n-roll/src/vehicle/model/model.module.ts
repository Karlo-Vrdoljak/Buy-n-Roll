import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLogs } from 'src/db.logs';
import { Model } from 'src/entity/model.entity';
import { ModelService } from './model.service';
import { ModelController } from 'src/controllers/vehicle/model/model.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Model]), HttpModule],
  providers: [ModelService, DbLogs],
  controllers: [ModelController],
  exports: [ModelService, TypeOrmModule],
})
export class ModelModule {}
