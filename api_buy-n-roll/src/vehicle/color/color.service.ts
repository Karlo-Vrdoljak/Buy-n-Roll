import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { concat, of } from 'rxjs';
import { Color } from 'src/entity/color.entity';
import { Repository } from 'typeorm';
import { DbLogs } from 'src/db.logs';


@Injectable()
export class ColorService implements OnModuleInit {

  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
    public httpService: HttpService,
    public dbLogs:DbLogs
  ) {}

  onModuleInit() { }

  findAll(): Promise<Color[]> {
    return this.colorRepository.find();
  }

  findOne(PkColor: number): Promise<Color> {
    return this.colorRepository.findOne(PkColor);
  }

  async remove(PkColor: number): Promise<void> {
    await this.colorRepository.delete(PkColor);
  }
  count() {
    return this.colorRepository.count();
  }
  getRepo() {
    return this.colorRepository;
  }
}
