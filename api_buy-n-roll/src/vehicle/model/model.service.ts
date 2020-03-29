import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { concat, of } from 'rxjs';
import { Repository } from 'typeorm';
import { DbLogs } from 'src/db.logs';
import { Model } from 'src/entity/model.entity';

@Injectable()
export class ModelService implements OnModuleInit {
  constructor(
    @InjectRepository(Model)
    private readonly ModelRepository: Repository<Model>,
    public httpService: HttpService,
    public dbLogs: DbLogs,
  ) {}

  onModuleInit() {
    this.ModelRepository.count().then(count => {
      if (count == 0) { }
    });
  }

  findAll(): Promise<Model[]> {
    return this.ModelRepository.find();
  }

  findOne(PkModel: number): Promise<Model> {
    return this.ModelRepository.findOne(PkModel);
  }

  async remove(PkModel: number): Promise<void> {
    await this.ModelRepository.delete(PkModel);
  }
}
