import { Controller, Get } from '@nestjs/common';
import { OglasService } from 'src/users/oglas/oglas.service';
import { Oglas } from 'src/entity/oglas.entity';

@Controller('oglas')
export class OglasController {
  constructor(private oglasService:OglasService) { }
  
  // @Get()
  // async get(): Promise<Oglas> {
  //   let oglas = await this.oglasService.getRepo().findOne(1);
  //   console.log(oglas);
  //   oglas.priceMainCurrency = '2324';
  //   oglas.priceSubCurrency = '98';
  //   oglas.currencyName = 'EUR';
  //   await this.oglasService.getRepo().save(oglas);
  //   return this.oglasService.getRepo().findOne(1);
  // }
}
