import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DbLogs } from 'src/db.logs';
import { Manufacturer } from 'src/entity/manufacturer.entity';

@Injectable()
export class ManufacturerService implements OnModuleInit {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
    public httpService: HttpService,
    public dbLogs: DbLogs,
  ) {}

  onModuleInit() {
    this.manufacturerRepository.count().then(count => {
      if (count == 0) { }
    });
  }

  findAll(): Promise<Manufacturer[]> {
    return this.manufacturerRepository.find();
  }

  findOne(PkManufacturer: number): Promise<Manufacturer> {
    return this.manufacturerRepository.findOne(PkManufacturer);
  }

  async remove(PkManufacturer: number): Promise<void> {
    await this.manufacturerRepository.delete(PkManufacturer);
  }
  async count(): Promise<number> {
    return await this.manufacturerRepository.count();
  }
  getRepo() {
    return this.manufacturerRepository;
  }
}
