import { Controller, Get, Request, HttpService, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { SeriesService } from 'src/vehicle/series/series.service';
import { ManufacturerService } from 'src/vehicle/manufacturer/manufacturer.service';
import { ModelService } from 'src/vehicle/model/model.service';

@Controller('api/vehicle/model/')
export class ModelController {

  constructor(private modelService:ModelService, private seriesService: SeriesService) { }

  @Get(':pk')
  getModelsByPkSeries(@Param() params) {
    return this.findModelsBySeries(params.pk);
  }

  findModelsBySeries(pkSeries) {
    return this.seriesService
			.getRepo()
			.createQueryBuilder('series')
      .leftJoinAndSelect('series.models', 'm', 'm.series')
      .where("series.PkSeries = :pk", { pk: pkSeries })
      .getOne();
  }
}
