import { Controller, UseGuards, Post, Request, Res, HttpService } from '@nestjs/common';
import { Response } from 'express';
import { Config } from 'src/config';

@Controller('user')
export class UserController {

  constructor(private http: HttpService, private config: Config) {
    
  }

  @Post('/findLocation/query')
  async findLocationByQuery(@Request() req, @Res() res: Response) {

    this.http.get(encodeURI(`https://eu1.locationiq.com/v1/search.php?key=${this.config.locationIQ_token}&q=${req.body.search}&format=json&normalizeaddress=1&normalizecity=1&accept-language=${req.body.lang}`))
      .subscribe(result => {
        res.status(200).send(result.data);
        
      }, err => {
        res.status(500).send(err);
      });
  }
}
