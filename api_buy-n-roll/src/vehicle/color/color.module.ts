import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorService } from './color.service';
import { ColorController } from 'src/controllers/vehicle/color/color.controller';
import { Color } from 'src/entity/color.entity';
import { DbLogs } from 'src/db.logs';

@Module({
  imports: [TypeOrmModule.forFeature([Color]), HttpModule],
  providers: [ColorService, DbLogs],
  controllers: [ColorController],
  exports: [ColorService, TypeOrmModule],
})
export class ColorModule {}
