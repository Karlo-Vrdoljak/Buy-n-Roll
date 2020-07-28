import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Favourites } from "src/entity/favourites.entity";
import { Repository, Connection } from "typeorm";
import { DbLogs } from "src/db.logs";
import { PhotoDescriptions } from "src/types/enums";



@Injectable()
export class FavouritesService implements OnModuleInit {

  constructor(
    @InjectRepository(Favourites)
    private readonly favouritesRepository: Repository<Favourites>,
    public dbLogs:DbLogs,
    private connection: Connection
  ) {}

  onModuleInit() {
    this.favouritesRepository.count().then(count => {
        if(count == 0) { }
    });
  }

  findAll(): Promise<Favourites[]> {
    return this.favouritesRepository.find();
  }

  findOne(PkFavourites: number): Promise<Favourites> {
    return this.favouritesRepository.findOne(PkFavourites);
  }

  async remove(PkFavourites: number): Promise<void> {
    await this.favouritesRepository.delete(PkFavourites);
  }

  getRepo() {
    return this.favouritesRepository;
  }
  getConnection() {
    return this.connection;
  }
  
}
