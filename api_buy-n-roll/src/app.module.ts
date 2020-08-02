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
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    UsersModule,
    RolesModule,
    // VehicleModule,
    ScheduleModule.forRoot(),
    AuthModule,
    TypeOrmModule.forRoot(),
    MulterModule
  ],
  controllers: [AppController, TestProtectedController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
