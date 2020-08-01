
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule, Module } from "@nestjs/common";
import { DbLogs } from "src/db.logs";
import { CommentsService } from "./comments.service";
import { Comments } from "src/entity/comments.entity";


@Module({
  imports: [TypeOrmModule.forFeature([Comments]), HttpModule],
  providers: [CommentsService, DbLogs],
  controllers: [],
  exports: [CommentsService, TypeOrmModule],
})
export class CommentsModule { }
