import { Controller, Get, Request, HttpService, Res } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { ManufacturerService } from 'src/vehicle/manufacturer/manufacturer.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

@Controller('api/vehicle/search/')
export class SearchController {
  constructor(private vehicleService: VehicleService) {}

  @Get('detailed')
  async getOglasiByManufSerieModel(@Request() req, @Res() res: Response) {
    let oglasi = await this.vehicleService.findOglasiBySimpleProps(req.query);    
    this.fillOglasPhotos(oglasi).then(oglasi => {
      res.status(HttpStatus.OK).send(oglasi);
    });    
  }

  @Get(':query')
  async getOglasiBySearchString(@Param() params, @Res() res: Response) {
    let oglasi = await this.vehicleService.findOglasiBySearchString(params.query);
    this.fillOglasPhotos(oglasi).then(oglasi => {
      res.status(HttpStatus.OK).send(oglasi);
    });

  }

  async fillOglasPhotos(oglasi) {
    if(oglasi) {  
      oglasi = await Promise.all(oglasi.map(async (o:any) => {
        o['photos'] = (await this.vehicleService.oglasService.getRepo().createQueryBuilder('o')
        .leftJoinAndSelect('o.photos', 'p', 'p.oglas').getMany()).map(data => data.photos);
        return o;
      }));
      return oglasi;
    }
    return null;
  }
}
