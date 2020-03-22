import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entity/role.entity';
import { RolesService } from './roles.service';
import { RoleController } from 'src/controllers/role/role.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesService],
  controllers: [
    RoleController
  ],
  exports: [
      RolesService,
      TypeOrmModule
    ]
})
export class RolesModule {}
