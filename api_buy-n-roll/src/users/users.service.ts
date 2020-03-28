import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Connection } from 'typeorm';
import { Role } from 'src/entity/role.entity';
import { DbLogs } from 'src/db.logs';


@Injectable()
export class UsersService implements OnModuleInit{
  
  private users: User[];

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly connection: Connection,
    private dbLogs: DbLogs
  ) { }

  onModuleInit() {
    this.usersRepository.count().then((count) => {
      if (count == 0) {
        this.initUsers().then(()=> this.dbLogs.usersWithRolesInit());
      }
    });
  }

  async initUsers() {
    await this.connection.transaction(async manager => {
      const roleAdmin = new Role();
      const roleUser = new Role();
      const userAdmin = new User();
      const user = new User();

      roleAdmin.name = "admin";
      roleUser.name = "user";

      await manager.save(roleUser);
      await manager.save(roleAdmin);

      userAdmin.firstName = "Karlo";
      userAdmin.lastName = "Vrdoljak";
      userAdmin.username = "admin";
      userAdmin.password = "admin";
      // userAdmin.roles = [roleAdmin, roleUser];

      await manager.save(userAdmin);

      user.firstName = "K";
      user.lastName = "V";
      user.username = "user";
      user.password = "user";
      // user.roles = [roleUser];

      await manager.save(user);

      roleUser.user = userAdmin;
      roleAdmin.user = userAdmin;  
      
      const roleUserOther = new Role();
      roleUserOther.name = "user";

      await manager.save(roleUser);
      
      await manager.save(roleAdmin);
      
      roleUserOther.user = user;

      await manager.save(roleUserOther);

    });
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.roles","role","role.user")
      .where("user.username = :username", { username: username })
      .getOne();
  }
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneById(PkUser: string): Promise<User> {
    return this.usersRepository.findOne(PkUser);
  }

  async remove(PkUser: string): Promise<void> {
    await this.usersRepository.delete(PkUser);
  }
}