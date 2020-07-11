import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from 'src/entity/location.entity';
import { LocationService } from './location.service';
@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  providers: [LocationService],
  controllers: [],
  exports: [LocationService, TypeOrmModule],
})
export class LocationModule {}
