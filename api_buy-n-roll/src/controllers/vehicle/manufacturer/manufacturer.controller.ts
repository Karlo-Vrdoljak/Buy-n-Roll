import { Controller, Get, Request, HttpService, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ManufacturerService } from 'src/vehicle/manufacturer/manufacturer.service';

@Controller('api/vehicle/manufacturer/')
export class ManufacturerController {
  constructor(public manufacturerService: ManufacturerService) {}

  @Get()
  getAllManufacturers(@Request() req) {
    return this.manufacturerService.findAll();
  }
}
