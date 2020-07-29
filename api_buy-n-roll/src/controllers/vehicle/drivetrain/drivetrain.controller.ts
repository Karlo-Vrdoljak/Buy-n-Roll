import { Controller, Get, Request, HttpService, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { DrivetrainService } from 'src/vehicle/drivetrain/drivetrain.service';

@Controller('vehicle/drivetrain/')
export class DrivetrainController { 
  constructor(public drivetrainService:DrivetrainService) { }

  @Get()
  getColors(@Request() req) {
    return this.drivetrainService.findAll();
  }
}
