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
import { Chassis } from 'src/entity/chassis.entity';
import { ColorService } from 'src/vehicle/color/color.service';
import { ChassisService } from 'src/vehicle/chassis/chassis.service';
import { Model } from 'src/entity/model.entity';
import { Series } from 'src/entity/series.entity';
import { Manufacturer } from 'src/entity/manufacturer.entity';
import { Body } from 'src/entity/body.entity';


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
    public colorService: ColorService,
    public chassisService: ChassisService,

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

    // this.userVehicleRepository.count().then((count) => {
    //   if (count > 0) {
    //     this.testFullVehicleQuery().then((result:UserVehicle[]) => {
    //       console.log(result[0]);
          
          
    //     });
    //   }
    // });
    
  }
  async initVehicleForUser() {
    await this.connection.transaction(async manager => {
      const dbUserVehicle = new UserVehicle();
      
      dbUserVehicle.RegistriranDaNe = true;

      let result = await this.connection
      .query(`
        select  s.seriesName, s.PkSeries,  m.manufacturerName, m.PkManufacturer, ml.modelName, ml.PkModel, ml.endOfProductionYear from series s
        left join manufacturer m on s.manufacturerPkManufacturer  = m.PkManufacturer
        left join model ml on s.PkSeries = ml.seriesPkSeries
        where MATCH (s.seriesName)
        AGAINST (? IN BOOLEAN MODE)
        and MATCH (m.manufacturerName)
        AGAINST (? IN BOOLEAN MODE)
        and MATCH (ml.modelName)
        AGAINST (? IN BOOLEAN MODE);
      `, ['gsi opel astra 2.0 16 hp','gsi opel astra 2.0 16 hp','gsi opel astra 2.0 16 hp']);
      let dbData = result[0] as { seriesName: string, PkSeries: number, manufacturerName: string, PkManufacturer: 86, modelName: string, PkModel: number, endOfProductionYear: string, };

      let chassis = new Chassis();

      let model = await this.modelService.getRepo()
      .createQueryBuilder('m')
      .where('m.PkModel = :PkModel', { PkModel: dbData.PkModel })
      .getOne();

      let color = await this.colorService.getRepo()
      .createQueryBuilder('c')
      .where('c.color = :color', { color: 'midnight blue' })
      .getOne();

      chassis.model = model;
      chassis.makeYear = '1991';
      chassis.color = color;

      await manager.save(chassis);
      
      // dbUserVehicle.chassis = await this.chassisService.getRepo()
      // .createQueryBuilder('c')
      // .where('c.modelPkModel = :PkModel', { PkModel: dbData.PkModel })
      // .getOne();

      
      dbUserVehicle.chassis = chassis;

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

  testFullVehicleQuery() {
    return this.userVehicleRepository
    .createQueryBuilder('uv')
    // .select('uv.RegistriranDaNe, ch.makeYear, u.username, ml.endOfProductionYear, ml.modelName, s.seriesName, m.manufacturerName, b.BodyName')
    .leftJoinAndSelect('uv.chassis','ch')
    .leftJoinAndSelect('uv.user','u')
    .leftJoinAndSelect('ch.model','ml')
    .leftJoinAndSelect('ch.color','c')
    .leftJoinAndSelect('ml.series','s')
    .leftJoinAndSelect('s.manufacturer','m')
    .leftJoinAndSelect('ml.body','b')
    .getMany();
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
  getUserRepo() { return this.usersRepository; }
}