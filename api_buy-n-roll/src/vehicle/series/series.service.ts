import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DbLogs } from 'src/db.logs';
import { Series } from 'src/entity/series.entity';
import { seriesList } from '../../assets/static/series-list'
import { Manufacturer } from 'src/entity/manufacturer.entity';

@Injectable()
export class SeriesService implements OnModuleInit {

  constructor(
    @InjectRepository(Series)
    private readonly seriesRepository: Repository<Series>,
    public httpService: HttpService,
    public dbLogs:DbLogs
  ) {}

  onModuleInit() {
    this.seriesRepository.count().then(count => {
			if(count == 0) { }
    });
  }

  findAll(): Promise<Series[]> {
    return this.seriesRepository.find();
  }

  findOne(PkSeries: number): Promise<Series> {
    return this.seriesRepository.findOne(PkSeries);
  }

  async remove(PkSeries: number): Promise<void> {
    await this.seriesRepository.delete(PkSeries);
  }

  getRepo() {
    return this.seriesRepository;
  }
}
