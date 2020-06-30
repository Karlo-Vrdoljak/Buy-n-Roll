import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLogs } from 'src/db.logs';
import { Oglas } from 'src/entity/oglas.entity';
import { OglasController } from 'src/controllers/user/oglas/oglas.controller';
import { OglasService } from './oglas.service';
import { PhotoModule } from './photo/photo.module';

@Module({
  imports: [TypeOrmModule.forFeature([Oglas]), HttpModule, PhotoModule],
  providers: [OglasService, DbLogs],
  controllers: [OglasController],
  exports: [OglasService, TypeOrmModule, PhotoModule],
})
export class OglasModule {}
