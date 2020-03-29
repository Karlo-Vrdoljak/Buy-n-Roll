import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLogs } from 'src/db.logs';
import { Body } from 'src/entity/body.entity';
import { BodyService } from './body.service';
import { BodyController } from 'src/controllers/vehicle/body/body.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Body]), HttpModule],
  providers: [BodyService, DbLogs],
  controllers: [BodyController],
  exports: [BodyService, TypeOrmModule],
})
export class BodyModule {}
