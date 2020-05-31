import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DbLogs } from 'src/db.logs';
import { Body } from 'src/entity/body.entity';


@Injectable()
export class BodyService implements OnModuleInit {

  constructor(
    @InjectRepository(Body)
    private readonly bodyRepository: Repository<Body>,
    public httpService: HttpService,
    public dbLogs:DbLogs
  ) {}

  onModuleInit() {
    this.bodyRepository.count().then(count => {
        if(count == 0) { }
    });
  }

  findAll(): Promise<Body[]> {
    return this.bodyRepository.find();
  }

  findOne(PkBody: number): Promise<Body> {
    return this.bodyRepository.findOne(PkBody);
  }

  async remove(PkBody: number): Promise<void> {
    await this.bodyRepository.delete(PkBody);
  }

  count() {
    return this.bodyRepository.count();
  }
  getRepo() {
    return this.bodyRepository;
  }
}
