import { Controller, Get, HttpService, Res, Post,  Request, OnModuleInit } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { ManufacturerService } from 'src/vehicle/manufacturer/manufacturer.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ModuleRef } from '@nestjs/core';
import { Favourites } from 'src/entity/favourites.entity';


@Controller('api/vehicle/search/')
export class SearchController implements OnModuleInit{
  constructor(private vehicleService: VehicleService, private http: HttpService, private moduleRef: ModuleRef) {}
  auth: AuthService;
  onModuleInit() {
    this.auth = this.moduleRef.get(AuthService, {strict:false});
  }

  @Get('detailed')
  async getOglasiByManufSerieModel(@Request() req, @Res() res: Response) {
    let oglasi = await this.vehicleService.findOglasiBySimpleProps(req.query);
    this.fillOglasPhotos(oglasi).then(async ret => {
      if(req.headers?.authorization?.split('Bearer ')) {
        let token = req.headers.authorization.split('Bearer ')[1];
        ret = await this.checkFavourite(ret,token);
      } else {
        ret = await this.checkFavourite(ret,null);

      }
      res.status(HttpStatus.OK).send(ret);
    });    
  }

  @Get('advanced')
  async getOglasiAdvancedQuery(@Request() req, @Res() res: Response) {
    let oglasi = await this.vehicleService.findOglasiByAllProps(req.query);
    
    this.fillOglasPhotos(oglasi).then(async ret => {
      if(req.headers?.authorization?.split('Bearer ')) {
        let token = req.headers.authorization.split('Bearer ')[1];
        ret = await this.checkFavourite(ret,token);
      } else {
        ret = await this.checkFavourite(ret,null);

      }
      res.status(HttpStatus.OK).send(ret);
    });    
  }

  @Get(':query')
  async getOglasiBySearchString(@Param() params, @Request() req, @Res() res: Response) {
    let oglasi = await this.vehicleService.findOglasiBySearchString(params.query);
    this.fillOglasPhotos(oglasi).then(async ret => {
      if(req.headers?.authorization?.split('Bearer ')) {
        let token = req.headers.authorization.split('Bearer ')[1];
        ret = await this.checkFavourite(ret,token);
      } else {
        ret = await this.checkFavourite(ret,null);

      }
      
      res.status(HttpStatus.OK).send(ret);
    });

  }

  @Post('exchangeRate')
  async getExchangeRate(@Request() req, @Res() res: Response) {
    this.http.get(encodeURI(`https://api.exchangeratesapi.io/latest?symbols=${req.body.code}`))
      .subscribe((result:any) => {
        res.status(HttpStatus.OK).send(result.data.rates);
        
      }, err => {
        res.status(HttpStatus.BAD_REQUEST).send(err);
      });
  }

  async checkFavourite(oglasi, token) {
    if(oglasi) {
      let user = this.auth.decodeToken(token);
      oglasi = await Promise.all(oglasi.map(async (o:any) => {
        if(token) {
          let userFavourite = await this.vehicleService.oglasService.getConnection().createQueryBuilder(Favourites,'f')
            .where('f.userUserId = :id', {id : user.sub})
            .andWhere('f.oglasPkOglas = :pkOglas', {pkOglas: o.PkOglas}).getOne();
          if(userFavourite) {
            o['alreadyFavourited'] = true;
          } else {
            o['alreadyFavourited'] = false;
          }
        }
        return o;
      }));
      return oglasi;
    } else {
      return null;
    }
  }

  async fillOglasPhotos(oglasi) {
    if(oglasi) {  
      oglasi = await Promise.all(oglasi.map(async (o:any) => {
        o['photos'] = (await this.vehicleService.oglasService.getRepo().createQueryBuilder('o')
        .leftJoinAndSelect('o.photos', 'p', 'p.oglas').where('o.PkOglas = :pk', {pk: o.PkOglas}).getOne()).photos;
        return o;
      }));
      return oglasi;
    }
    return null;
  }
}
