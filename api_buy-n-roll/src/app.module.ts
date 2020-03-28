import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestProtectedController } from './controllers/test-protected/test-protected.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { RolesModule } from './roles/roles.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ColorModule } from './vehicle/color/color.module';
import { ChassisModule } from './vehicle/chassis/chassis.module';
import { SeriesModule } from './vehicle/series/color.module';


@Module({
  imports: [
    UsersModule,
    RolesModule,
    ColorModule,
    ChassisModule,
    SeriesModule,
    AuthModule,
    TypeOrmModule.forRoot(),
    MulterModule,
  ],
  controllers: [AppController, TestProtectedController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
