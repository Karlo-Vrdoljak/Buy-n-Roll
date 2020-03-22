import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';


@Controller('api/test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { title:string, value:string } {
    return {
      title: this.appService.getHello(),
      value: 'first App in NestJs'
    };
  }
}
