import { Controller, Get, Request, HttpService } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { ManufacturerService } from 'src/vehicle/manufacturer/manufacturer.service';
import { VehicleService } from 'src/vehicle/vehicle.service';

@Controller('api/vehicle/search/')
export class SearchController {
  constructor(private vehicleService: VehicleService) {}

  @Get('detailed')
  getOglasiByManufSerieModel(@Request() req) {
    return this.vehicleService.findOglasiBySimpleProps(req.query);
  }

  @Get(':query')
  getOglasiBySearchString(@Param() params) {
    return this.vehicleService.findOglasiBySearchString(params.query);
  }
}