import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbLogs } from 'src/db.logs';
import { Photo } from 'src/entity/photo.entity';
import { PhotoService } from './photo.service';
import { PhotoController } from 'src/controllers/user/oglas/photo/photo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Photo]), HttpModule],
  providers: [PhotoService, DbLogs],
  controllers: [PhotoController],
  exports: [PhotoService, TypeOrmModule],
})
export class PhotoModule {}
