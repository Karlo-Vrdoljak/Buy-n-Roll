import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLogs } from 'src/db.logs';
import { GasType } from 'src/entity/gasType.entity';
import { GasTypeService } from './gasType.service';
import { GasTypeController } from 'src/controllers/vehicle/gasType/gasType.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GasType]), HttpModule],
  providers: [GasTypeService, DbLogs],
  controllers: [GasTypeController],
  exports: [GasTypeService, TypeOrmModule],
})
export class GasTypeModule {}
