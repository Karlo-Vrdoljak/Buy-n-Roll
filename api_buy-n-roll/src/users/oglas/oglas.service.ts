import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DbLogs } from 'src/db.logs';
import { Oglas } from 'src/entity/oglas.entity';


@Injectable()
export class OglasService implements OnModuleInit {

  constructor(
    @InjectRepository(Oglas)
    private readonly oglasRepository: Repository<Oglas>,
    public dbLogs:DbLogs
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
  findOglasiByUsername(username:string) {
    return this.oglasRepository.createQueryBuilder('o')
    .leftJoinAndSelect("o.photos","p","p.oglas")
    .leftJoinAndSelect("o.vehicle","v")
    .leftJoinAndSelect("o.location","l")
    .leftJoinAndSelect("v.user","u")
    .leftJoinAndSelect("v.chassis","ch")
    .leftJoinAndSelect("ch.color","c")
    .leftJoinAndSelect("ch.model","ml")
    .leftJoinAndSelect("ml.drivetrain","dt")
    .leftJoinAndSelect("ml.transmission","tr")
    .leftJoinAndSelect("ml.gasType","gt")
    .leftJoinAndSelect("ml.body","b")
    .leftJoinAndSelect("ml.series","s")
    .leftJoinAndSelect("s.manufacturer","m")
    .where('u.username = :uname', { uname: username })
    .getMany()
  }
}
