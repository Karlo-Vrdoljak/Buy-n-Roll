import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLogs } from 'src/db.logs';
import { Trim } from 'src/entity/trim.entity';
import { TrimService } from './trim.service';
import { TrimController } from 'src/controllers/vehicle/trim/series.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Trim]), HttpModule],
  providers: [TrimService, DbLogs],
  controllers: [TrimController],
  exports: [TrimService, TypeOrmModule],
})
export class TrimModule {}
