import { Controller, Get, Request, HttpService, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { BodyService } from 'src/vehicle/body/body.service';

@Controller('vehicle/body/')
export class BodyController { 
  constructor(private bodyService: BodyService){ }

  @Get()
  getBody(@Request() req) {
    return this.bodyService.findAll();
  }
}
