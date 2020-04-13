import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DbLogs } from 'src/db.logs';
import { UserVehicle } from 'src/entity/userVehicle.entity';


@Injectable()
export class UserVehicleService implements OnModuleInit {

  constructor(
    @InjectRepository(UserVehicle)
    private readonly userVehicleRepository: Repository<UserVehicle>,
    public dbLogs:DbLogs
  ) {}

  onModuleInit() {
    this.userVehicleRepository.count().then(count => {
        if(count == 0) { }
    });
  }

  findAll(): Promise<UserVehicle[]> {
    return this.userVehicleRepository.find();
  }

  findOne(PkUserVehicle: number): Promise<UserVehicle> {
    return this.userVehicleRepository.findOne(PkUserVehicle);
  }

  async remove(PkUserVehicle: number): Promise<void> {
    await this.userVehicleRepository.delete(PkUserVehicle);
  }

  getRepo() {
    return this.userVehicleRepository;
  }
}
