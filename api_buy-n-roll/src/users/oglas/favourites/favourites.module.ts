
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favourites } from "src/entity/favourites.entity";
import { HttpModule, Module } from "@nestjs/common";
import { PhotoModule } from "../photo/photo.module";
import { DbLogs } from "src/db.logs";
import { FavouritesService } from "./favourites.service";


@Module({
  imports: [TypeOrmModule.forFeature([Favourites]), HttpModule],
  providers: [FavouritesService, DbLogs],
  controllers: [],
  exports: [FavouritesService, TypeOrmModule],
})
export class FavouritesModule { }
