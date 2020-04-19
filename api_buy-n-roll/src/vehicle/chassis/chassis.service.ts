import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { concat, of } from 'rxjs';
import { Repository } from 'typeorm';
import { DbLogs } from 'src/db.logs';
import { Chassis } from 'src/entity/chassis.entity';

@Injectable()
export class ChassisService implements OnModuleInit {
  constructor(
    @InjectRepository(Chassis)
    private readonly chassisRepository: Repository<Chassis>,
    public httpService: HttpService,
    public dbLogs: DbLogs,
  ) {}

  onModuleInit() {
    this.chassisRepository.count().then(count => {
      if (count == 0) { }
    });
  }

  findAll(): Promise<Chassis[]> {
    return this.chassisRepository.find();
  }

  findOne(PkChassis: number): Promise<Chassis> {
    return this.chassisRepository.findOne(PkChassis);
  }

  async remove(PkChassis: number): Promise<void> {
    await this.chassisRepository.delete(PkChassis);
  }
  getRepo() { return this.chassisRepository };
}
