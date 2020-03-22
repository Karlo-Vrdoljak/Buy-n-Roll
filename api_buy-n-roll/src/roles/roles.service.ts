import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/entity/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}
	
	findAll(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  findOne(roleId: string): Promise<Role> {
    return this.rolesRepository.findOne(roleId);
  }

  async remove(roleId: string): Promise<void> {
    await this.rolesRepository.delete(roleId);
  }
}
