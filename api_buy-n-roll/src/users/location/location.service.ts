import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from 'src/entity/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}
	
	findAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  findOne(PkLocation: number): Promise<Location> {
    return this.locationRepository.findOne(PkLocation);
  }

  async remove(PkLocation: number): Promise<void> {
    await this.locationRepository.delete(PkLocation);
  }

  getRepo() {
    return this.locationRepository;
  }

}
