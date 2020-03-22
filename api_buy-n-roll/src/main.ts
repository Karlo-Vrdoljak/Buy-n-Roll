import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from './config';
import helmet = require('helmet');
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const config = new Config();
  const app = await NestFactory.create(AppModule);
  //   app.use(express.static(join(__dirname,'/controllers/music/uploads')));
  app.enableCors(config.corsOptions);

  await app.listen(3000);
}
bootstrap();
