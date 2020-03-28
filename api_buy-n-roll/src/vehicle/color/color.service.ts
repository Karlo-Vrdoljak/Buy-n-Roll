import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { concat, of } from 'rxjs';
import { Color } from 'src/entity/color.entity';
import { Repository } from 'typeorm';
import * as COLORS from '../../assets/static/color-names.json';
import { DbLogs } from 'src/db.logs';


@Injectable()
export class ColorService implements OnModuleInit {

  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
    public httpService: HttpService,
    public dbLogs:DbLogs
  ) {}

  onModuleInit() {
    this.colorRepository.count().then(count => {
			if(count == 0) {
        concat(of (Object.keys(COLORS).map(key => this.colorRepository.save( { color:key,colorCode:COLORS[key]} )))).subscribe(val => this.dbLogs.vehicleColorInit());
      }
    });
  }

  findAll(): Promise<Color[]> {
    return this.colorRepository.find();
  }

  findOne(PkColor: number): Promise<Color> {
    return this.colorRepository.findOne(PkColor);
  }

  async remove(PkColor: number): Promise<void> {
    await this.colorRepository.delete(PkColor);
  }
}
