import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Connection } from "typeorm";
import { DbLogs } from "src/db.logs";
import { PhotoDescriptions } from "src/types/enums";
import { Comments } from "src/entity/comments.entity";



@Injectable()
export class CommentsService implements OnModuleInit {

  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    public dbLogs:DbLogs,
    private connection: Connection
  ) {}

  onModuleInit() {
    this.commentsRepository.count().then(count => {
        if(count == 0) { }
    });
  }

  findAll(): Promise<Comments[]> {
    return this.commentsRepository.find();
  }

  findOne(id: number): Promise<Comments> {
    return this.commentsRepository.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.commentsRepository.delete(id);
  }

  getRepo() {
    return this.commentsRepository;
  }
  getConnection() {
    return this.connection;
  }
  
}
