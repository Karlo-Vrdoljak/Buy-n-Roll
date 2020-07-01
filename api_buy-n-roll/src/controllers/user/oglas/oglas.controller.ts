import { Controller, Get, Param } from '@nestjs/common';
import { OglasService } from 'src/users/oglas/oglas.service';
import { Oglas } from 'src/entity/oglas.entity';

@Controller('api/oglas/')
export class OglasController {
  constructor(private oglasService:OglasService) { }
  
  @Get(':query')
  getOglasiBySearchString(@Param() params) {
    return this.oglasService.getRepo().createQueryBuilder('o')
        .leftJoinAndSelect("o.photos","p","p.oglas")
        .leftJoinAndSelect("o.vehicle","v")
        .leftJoinAndSelect("o.location","l")
        .leftJoinAndSelect("v.user","u")
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
  }
}
