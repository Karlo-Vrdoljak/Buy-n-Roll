import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { DbLogs } from 'src/db.logs';
import { Oglas } from 'src/entity/oglas.entity';
import { PhotoDescriptions } from 'src/types/enums';
import { Location } from 'src/entity/location.entity';
import { Favourites } from 'src/entity/favourites.entity';



@Injectable()
export class OglasService implements OnModuleInit {

  constructor(
    @InjectRepository(Oglas)
    private readonly oglasRepository: Repository<Oglas>,
    public dbLogs:DbLogs,
    private connection: Connection
  ) {}

  onModuleInit() {
    this.oglasRepository.count().then(count => {
        if(count == 0) { }
    });
  }

  findAll(): Promise<Oglas[]> {
    return this.oglasRepository.find();
  }

  findOne(PkOglas: number): Promise<Oglas> {
    return this.oglasRepository.findOne(PkOglas);
  }

  async remove(PkOglas: number): Promise<void> {
    await this.oglasRepository.delete(PkOglas);
  }

  getRepo() {
    return this.oglasRepository;
  }
  getConnection() {
    return this.connection;
  }
  findOglasiByUsername(username:string) {
    return this.oglasRepository.createQueryBuilder('o')
    .leftJoinAndSelect("o.photos","p","p.oglas")
    .leftJoinAndSelect("o.vehicle","v")
    .leftJoinAndSelect("o.location","l")
    .leftJoinAndSelect("v.user","u")
    .leftJoinAndSelect("v.chassis","ch")
    .leftJoinAndSelect("ch.color","c")
    .leftJoinAndSelect("ch.model","ml")    
    .leftJoinAndSelect("ch.drivetrain","dt")
    .leftJoinAndSelect("ch.transmission","tr")
    .leftJoinAndSelect("ch.gasType","gt")
    .leftJoinAndSelect("ch.body","b")
    .leftJoinAndSelect("ml.series","s")
    .leftJoinAndSelect("s.manufacturer","m")
    .where('u.username = :uname', { uname: username })
    .getMany()
  }
  findOglasByPk(pk:number) {
    return this.oglasRepository.createQueryBuilder('o')
    .leftJoinAndSelect("o.photos","p","p.oglas")
    .leftJoinAndSelect("o.vehicle","v")
    .leftJoinAndSelect("o.location","l")
    .leftJoinAndSelect("v.user","u")
    .leftJoinAndSelect("u.location","loc")
    .leftJoinAndSelect("v.chassis","ch")
    .leftJoinAndSelect("ch.color","c")
    .leftJoinAndSelect("ch.model","ml")
    .leftJoinAndSelect("ch.drivetrain","dt")
    .leftJoinAndSelect("ch.transmission","tr")
    .leftJoinAndSelect("ch.gasType","gt")
    .leftJoinAndSelect("ch.body","b")
    .leftJoinAndSelect("ml.series","s")
    .leftJoinAndSelect("s.manufacturer","m")
    .where('o.PkOglas = :PkOglas', { PkOglas: pk })
    .getOne();
  }
  
  findOglasPhotosByPkOglas(pkOglas) {
    return this.oglasRepository.createQueryBuilder('o')
      .leftJoinAndSelect("o.photos","p","p.oglas")
      .where('o.PkOglas = :PkOglas', { PkOglas: pkOglas })
      .andWhere('p.photoOpis = :key', {key: PhotoDescriptions.OGLAS}).getOne();
  }

  
  async handleSaveLocation(locationData:Location) {
    if(locationData.place_id) {
      let location = new Location();
      location.place_id = locationData.place_id;
      location.boundingbox = locationData.boundingbox;
      location.class = locationData.class;
      location.display_name = locationData.display_name;
      location.lat = locationData.lat;
      location.lon = locationData.lon;
      location.type = locationData.type;
      await this.connection.getRepository(Location).save(location);
      return location;
    }
  }

  async checkFavourite(oglas:Oglas, pkUser) {
    if(oglas) {
      if(pkUser) {
        let userFavourite = await this.getConnection().createQueryBuilder(Favourites,'f')
          .where('f.userUserId = :id', {id : pkUser})
          .andWhere('f.oglasPkOglas = :pkOglas', {pkOglas: oglas.PkOglas}).getRawOne();
        if(userFavourite) {
          oglas['alreadyFavourited'] = true;
        } else {
          oglas['alreadyFavourited'] = false;
        }
      }
      let rating = await this.getConnection().createQueryBuilder(Favourites, 'f')
        .where('f.oglasPkOglas = :pk', {pk: oglas.PkOglas})
        .getCount();
      console.log(rating);
      
      oglas.rating = rating ?? 0; 
      return oglas;
    } else {
      return null;
    }
  }
}
