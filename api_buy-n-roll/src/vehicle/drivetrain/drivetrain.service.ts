import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { concat, of } from 'rxjs';
import { Repository } from 'typeorm';
import { DbLogs } from 'src/db.logs';
import { Drivetrain } from 'src/entity/drivetrain.entity';

@Injectable()
export class DrivetrainService implements OnModuleInit {
  constructor(
    @InjectRepository(Drivetrain)
    private readonly drivetrainRepository: Repository<Drivetrain>,
    public httpService: HttpService,
    public dbLogs: DbLogs,
  ) {}

  onModuleInit() {
    this.drivetrainRepository.count().then(count => {
      if (count == 0) { }
    });
  }

  findAll(): Promise<Drivetrain[]> {
    return this.drivetrainRepository.find();
  }

  findOne(PkDrivetrain: number): Promise<Drivetrain> {
    return this.drivetrainRepository.findOne(PkDrivetrain);
  }

  async remove(PkDrivetrain: number): Promise<void> {
    await this.drivetrainRepository.delete(PkDrivetrain);
  }

  count() {
    return this.drivetrainRepository.count();
  }
  getRepo() {
    return this.drivetrainRepository;
  }
}
