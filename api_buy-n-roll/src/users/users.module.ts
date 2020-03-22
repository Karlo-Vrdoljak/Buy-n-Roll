import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { UserController } from 'src/controllers/user/user.controller';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [
    UserController
  ],
  exports: [
    UsersService,
    TypeOrmModule,
    ]
})
export class UsersModule {}
