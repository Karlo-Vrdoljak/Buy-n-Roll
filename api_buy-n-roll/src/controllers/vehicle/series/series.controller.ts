import { Controller, Get, Request, HttpService } from '@nestjs/common';
import { SeriesService } from 'src/vehicle/series/series.service';
import { Param } from '@nestjs/common';
import { ManufacturerService } from 'src/vehicle/manufacturer/manufacturer.service';

@Controller('api/vehicle/series/')
export class SeriesController {

  constructor(private seriesService:SeriesService, private manufacturerService: ManufacturerService) { }

  @Get(':pk')
  getSeriesByPk(@Param() params) {
    return this.findSeriesByManufacturer(params.pk);
  }

  findSeriesByManufacturer(pkManufacturer) {
    return this.manufacturerService
			.getRepo()
			.createQueryBuilder('manufacturer')
      .leftJoinAndSelect('manufacturer.series', 'serie', 'serie.manufacturer')
      .where("manufacturer.PkManufacturer = :pk", { pk: pkManufacturer })
      .getOne();
  }
}
