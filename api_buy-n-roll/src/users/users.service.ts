import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { Connection } from 'typeorm';
import { Role } from 'src/entity/role.entity';
import { DbLogs } from 'src/db.logs';
import { UserVehicle } from 'src/entity/userVehicle.entity';
import { ManufacturerService } from 'src/vehicle/manufacturer/manufacturer.service';
import { ModelService } from 'src/vehicle/model/model.service';
import { SeriesService } from 'src/vehicle/series/series.service';


@Injectable()
export class UsersService implements OnModuleInit{
  
  private users: User[];

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly connection: Connection,

    @InjectRepository(UserVehicle)
    private readonly userVehicleRepository:Repository<UserVehicle>,

    public manufacturerService: ManufacturerService,
    public modelService: ModelService,
    public seriesService: SeriesService,

    private dbLogs: DbLogs
  ) { }

  onModuleInit() {
    this.usersRepository.count().then((count) => {
      if (count == 0) {
        this.initUsers().then(()=> {
          this.dbLogs.successInit('Users & Roles');
          this.userVehicleRepository.count().then((count) => {
            if (count == 0) {
              this.initVehicleForUser().then(() => {
                this.dbLogs.successInit('Admin user\'s vehicle');
              });
            }
          });
        });
      }
    });
    
  }
  async initVehicleForUser() {
    await this.connection.transaction(async manager => {
      const dbUserVehicle = new UserVehicle();
      dbUserVehicle.manufacturer = await this.manufacturerService.getRepo()
       .createQueryBuilder("manufacturer")
       .where("manufacturer.manufacturerName = :manufacturerName", { manufacturerName: 'opel' })
       .getOne();

       dbUserVehicle.series = await this.seriesService.getRepo()
       .createQueryBuilder("series")
       .where("series.seriesName = :seriesName", { seriesName: 'astra 3 doors' })
       .getOne();

       dbUserVehicle.model = await this.modelService.getRepo().findOne({
         modelName:Like("%gsi 16v%")
       });

       dbUserVehicle.user = await this.usersRepository.findOne({
         username: Like('%admin%')
       });
      
      await manager.save(dbUserVehicle);
      
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

  findOneById(userId: string): Promise<User> {
    return this.usersRepository.findOne(userId);
  }

  async remove(userId: string): Promise<void> {
    await this.usersRepository.delete(userId);
  }
}