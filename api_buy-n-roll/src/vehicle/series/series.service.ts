import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DbLogs } from 'src/db.logs';
import { Series } from 'src/entity/series.entity';


@Injectable()
export class SeriesService implements OnModuleInit {

  constructor(
    @InjectRepository(Series)
    private readonly colorRepository: Repository<Series>,
    public httpService: HttpService,
    public dbLogs:DbLogs
  ) {}

  onModuleInit() {
    this.colorRepository.count().then(count => {
			if(count == 0) {
        this.dbLogs.warnNeedsInit("Series");
      }
    });
  }

  findAll(): Promise<Series[]> {
    return this.colorRepository.find();
  }

  findOne(PkSeries: number): Promise<Series> {
    return this.colorRepository.findOne(PkSeries);
  }

  async remove(PkSeries: number): Promise<void> {
    await this.colorRepository.delete(PkSeries);
  }
}
