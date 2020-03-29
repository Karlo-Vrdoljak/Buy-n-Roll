import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { concat, of } from 'rxjs';
import { Repository } from 'typeorm';
import { DbLogs } from 'src/db.logs';
import { Transmission } from 'src/entity/transmission.entity';

@Injectable()
export class TransmissionService implements OnModuleInit {
  constructor(
    @InjectRepository(Transmission)
    private readonly TransmissionRepository: Repository<Transmission>,
    public httpService: HttpService,
    public dbLogs: DbLogs,
  ) {}

  onModuleInit() {
    this.TransmissionRepository.count().then(count => {
      if (count == 0) { }
    });
  }

  findAll(): Promise<Transmission[]> {
    return this.TransmissionRepository.find();
  }

  findOne(PkTransmission: number): Promise<Transmission> {
    return this.TransmissionRepository.findOne(PkTransmission);
  }

  async remove(PkTransmission: number): Promise<void> {
    await this.TransmissionRepository.delete(PkTransmission);
  }
}
