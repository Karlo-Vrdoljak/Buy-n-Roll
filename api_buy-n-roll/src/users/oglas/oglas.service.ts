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
}
