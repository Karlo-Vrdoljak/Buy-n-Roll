import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DbLogs } from 'src/db.logs';
import { Photo } from 'src/entity/photo.entity';


@Injectable()
export class PhotoService implements OnModuleInit {

  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    public dbLogs:DbLogs
  ) {}

  onModuleInit() {
    this.photoRepository.count().then(count => {
        if(count == 0) { }
    });
  }

  findAll(): Promise<Photo[]> {
    return this.photoRepository.find();
  }

  findOne(PkPhoto: number): Promise<Photo> {
    return this.photoRepository.findOne(PkPhoto);
  }

  async remove(PkPhoto: number): Promise<void> {
    await this.photoRepository.delete(PkPhoto);
  }

  getRepo() {
    return this.photoRepository;
  }
}
