import { Controller, Get, Param, Res, HttpStatus } from '@nestjs/common';
import { OglasService } from 'src/users/oglas/oglas.service';
import { Oglas } from 'src/entity/oglas.entity';
import { Response } from 'express';
import * as fs from "fs";

@Controller('api/oglas/')
export class OglasController {
  constructor(private oglasService:OglasService) { }
  
  @Get(':query')
  async getOglasiBySearchString(@Param() params, @Res() res: Response) {
    let oglas = await this.oglasService.getRepo().createQueryBuilder('o')
      .leftJoinAndSelect("o.photos","p","p.oglas")
      .leftJoinAndSelect("o.vehicle","v")
      .leftJoinAndSelect("o.location","l")
      .leftJoinAndSelect("v.user","u")
      .leftJoinAndSelect("u.location","loc")
      .leftJoinAndSelect("v.chassis","ch")
      .leftJoinAndSelect("ch.color","c")
      .leftJoinAndSelect("ch.model","ml")
      .leftJoinAndSelect("ml.drivetrain","dt")
      .leftJoinAndSelect("ml.transmission","tr")
      .leftJoinAndSelect("ml.gasType","gt")
      .leftJoinAndSelect("ml.body","b")
      .leftJoinAndSelect("ml.series","s")
      .leftJoinAndSelect("s.manufacturer","m")
      .where('o.PkOglas = :PkOglas', { PkOglas: params.query })
      .getOne();
    if(oglas) {
      res.status(HttpStatus.OK).send(oglas);
    } else {
      res.status(HttpStatus.FAILED_DEPENDENCY).send();
    }
  }

  @Get()
  async get(): Promise<Oglas> {
    let oglas = await this.oglasService.getRepo().findOne(1);
    console.log(oglas);
    oglas.oglasOpis = `Prodaje se Opel Astra 1.8 16V
    cijena je ta zbog odlaska u inozemstvo...
    sportsko podvozje
    atestirani branici
    atestiran plin
    zadnja slika te felge su trenutno na njemu
    Astra nije registrirana,papiri uredni
    limarija u osrednjem stanju trebalo bi malo uložiti u nju...
    Najbitnije pali i vozi
    `;
    await this.oglasService.getRepo().save(oglas);
    return this.oglasService.getRepo().findOne(1);
  }
}
