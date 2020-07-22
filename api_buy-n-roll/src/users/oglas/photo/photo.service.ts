import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DbLogs } from 'src/db.logs';
import { Photo } from 'src/entity/photo.entity';
import { PhotoDescriptions } from 'src/types/enums';


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
  generatePhotoOglas(req) {
    let photo = new Photo();
    photo.destination = req.destination;
    photo.encoding = req.encoding;
    photo.fieldname = req.fieldname;
    photo.filename = req.filename;
    photo.mimetype = req.mimetype;
    photo.originalname = req.originalname;
    photo.path = req.path;
    photo.photoOpis = PhotoDescriptions.OGLAS;
    photo.photoTitle = (req.originalname as string).split('.')[1];
    photo.size = req.size;
    return photo;
  }
}
