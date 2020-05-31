import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { concat, of } from 'rxjs';
import { Repository } from 'typeorm';
import { DbLogs } from 'src/db.logs';
import { GasType } from 'src/entity/gasType.entity';

@Injectable()
export class GasTypeService implements OnModuleInit {
  constructor(
    @InjectRepository(GasType)
    private readonly gasTypeRepository: Repository<GasType>,
    public httpService: HttpService,
    public dbLogs: DbLogs,
  ) {}

  onModuleInit() {
    this.gasTypeRepository.count().then(count => {
      if (count == 0) { }
    });
  }

  findAll(): Promise<GasType[]> {
    return this.gasTypeRepository.find();
  }

  findOne(PkGasType: number): Promise<GasType> {
    return this.gasTypeRepository.findOne(PkGasType);
  }

  async remove(PkGasType: number): Promise<void> {
    await this.gasTypeRepository.delete(PkGasType);
  }
  count() {
    return this.gasTypeRepository.count();
  }
  getRepo() {
    return this.gasTypeRepository;
  }
}
