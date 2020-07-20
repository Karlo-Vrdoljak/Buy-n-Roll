import { Controller, Get, Request, HttpService, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ColorService } from 'src/vehicle/color/color.service';

@Controller('api/vehicle/color/')
export class ColorController {

  constructor(public colorService:ColorService) { }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('user')
  @Get()
  getColors(@Request() req) {
    return this.colorService.findAll();
  }
 }
