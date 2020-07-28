import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from './config';
import helmet = require('helmet');
import * as express from 'express';
import { join } from 'path';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const config = new Config();
  const app = await NestFactory.create(AppModule);
  app.use(express.static(join(__dirname, 'assets/static')));
  app.enableCors(config.corsOptions);
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 5 minutes
      max: 1000, // limit each IP to 100 retry count requests per windowMs
    }),
  );
  await app.listen(3000);
}
bootstrap();
