import { Controller, Get, Request, HttpService, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { TransmissionService } from 'src/vehicle/transmission/transmission.service';

@Controller('vehicle/transmission/')
export class TransmissionController {
  constructor(public tranService:TransmissionService) { }


  @Get()
  getColors(@Request() req) {
    return this.tranService.findAll();
  }
 }
