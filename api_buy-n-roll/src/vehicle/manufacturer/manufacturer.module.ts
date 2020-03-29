import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLogs } from 'src/db.logs';
import { Manufacturer } from 'src/entity/manufacturer.entity';
import { ManufacturerService } from './manufacturer.service';
import { ManufacturerController } from 'src/controllers/vehicle/manufacturer/manufacturer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer]), HttpModule],
  providers: [ManufacturerService, DbLogs],
  controllers: [ManufacturerController],
  exports: [ManufacturerService, TypeOrmModule],
})
export class ManufacturerModule {}
