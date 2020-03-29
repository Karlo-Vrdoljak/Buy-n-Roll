import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DbLogs } from 'src/db.logs';
import { Repository } from 'typeorm';
import { Trim } from 'src/entity/trim.entity';

@Injectable()
export class TrimService implements OnModuleInit {
  constructor(
    @InjectRepository(Trim)
    private readonly TrimRepository: Repository<Trim>,
    public httpService: HttpService,
    public dbLogs: DbLogs,
  ) {}

  onModuleInit() {
    this.TrimRepository.count().then(count => {
      if (count == 0) { }
    });
  }

  findAll(): Promise<Trim[]> {
    return this.TrimRepository.find();
  }

  findOne(PkTrim: number): Promise<Trim> {
    return this.TrimRepository.findOne(PkTrim);
  }

  async remove(PkTrim: number): Promise<void> {
    await this.TrimRepository.delete(PkTrim);
  }
}
