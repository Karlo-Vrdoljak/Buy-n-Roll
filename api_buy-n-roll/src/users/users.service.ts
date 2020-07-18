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
import { OglasService } from './oglas/oglas.service';
import { Oglas } from 'src/entity/oglas.entity';
import * as bcrypt from 'bcrypt';
import { DrivetrainService } from 'src/vehicle/drivetrain/drivetrain.service';
import { GasTypeService } from 'src/vehicle/gasType/gasType.service';
import { TransmissionService } from 'src/vehicle/transmission/transmission.service';
import { BodyService } from 'src/vehicle/body/body.service';
import { VehicleState, PhotoTypes } from 'src/types/enums';
import { Photo } from 'src/entity/photo.entity';
import { RolesService } from 'src/roles/roles.service';
import { Location } from 'src/entity/location.entity';
import { LocationService } from './location/location.service';

@Injectable()
export class UsersService implements OnModuleInit{
  
  private saltRounds = 10;

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
    public oglasService: OglasService,
    public drivetrainService: DrivetrainService,
    public gasTypeService: GasTypeService,
    public transmissionService: TransmissionService,
    public locationService: LocationService,
    public bodyService: BodyService,
    public roleService: RolesService,
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
                this.oglasService.getRepo().count().then(count => {
                  if (count == 0) {
                    this.initOglas().then(() => {
                      this.dbLogs.successInit('1st Oglas');
                    });
                  } 
                });
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
  async initOglas() {
    await this.connection.transaction(async manager => {
      let oglas = new Oglas;
      oglas.oglasNaziv = 'Opel astra gsi prvi vlasnik';
      oglas.oglasOpis = `
      Prodaje se Opel Astra 1.8 16V\n
      cijena je ta zbog odlaska u inozemstvo...\n
      sportsko podvozje\n
      atestirani branici\n
      atestiran plin\n
      zadnja slika te felge su trenutno na njemu\n
      Astra nije registrirana,papiri uredni\n
      limarija u osrednjem stanju trebalo bi malo uložiti u nju...
      `;
      oglas.vehicle = await this.userVehicleRepository.findOne(1);
      oglas.accessories = ["putno racunalo", "rezervno kolo", "3. štop", "alu felge"];
      oglas.airConditioning = ["nema"];
      oglas.comfortAccessories = ["šiber", "podizaci stakala", "recaro profilirani sicevi"];

      await manager.save(oglas);
    });
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
      let dbData = result[0] as { seriesName: string, PkSeries: number, manufacturerName: string, PkManufacturer: number, modelName: string, PkModel: number, endOfProductionYear: string, };
      let chassis = new Chassis();

      let model = await this.modelService.getRepo()
        .createQueryBuilder('m')
        .where('m.PkModel = :PkModel', { PkModel: dbData.PkModel })
        .getOne();

      let drivetrain = await this.drivetrainService.getRepo()
        .createQueryBuilder('dt')
        .where('dt.drivetrainCode = :code', { code: 'FWD'})
        .getOne();

      let gas = await this.gasTypeService.getRepo()
        .createQueryBuilder('g')
        .where('g.gasType = :x', { x: 'BENZIN' })
        .getOne();
      
      let transmission = await this.transmissionService.getRepo()
        .createQueryBuilder('t')
        .where('t.transmissionName = :tr', { tr: 'MANUAL' })
        .getOne();

      let body = await this.bodyService.getRepo()
        .createQueryBuilder('b')
        .where('b.bodyName = :bname', { bname: 'HATCHBACK' })
        .getOne();

      model.drivetrain = drivetrain;
      model.gasType = gas;
      model.transmission = transmission;
      model.body = body;

      await manager.save(model);

      let color = await this.colorService.getRepo()
      .createQueryBuilder('c')
      .where('c.color = :color', { color: 'midnight blue' })
      .getOne();

      chassis.model = model;
      chassis.makeYear = '1991';
      chassis.color = color;
      chassis.kilometers = '210000';
      chassis.consumption = 11;
      chassis.vehicleState = VehicleState.IZVRSNO;

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
      userAdmin.password = await this.getHash("admin");
      // userAdmin.roles = [roleAdmin, roleUser];

      await manager.save(userAdmin);

      user.firstName = "K";
      user.lastName = "V";
      user.username = "user";
      user.password = await this.getHash("user");
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
      .addSelect('user.password')
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

  async getHash(password: string|undefined): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
}

  async compareHash(password: string|undefined, hash: string|undefined): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  getUserRepo() { return this.usersRepository; }

  findUserByUsernameFollowRelations(username: string) {
    return this.usersRepository.createQueryBuilder('u')
    .leftJoinAndSelect("u.roles","r", "r.user")
    .leftJoinAndSelect("u.photo", "p")
    .leftJoinAndSelect("u.location", "l")
    .where('u.username = :uname', { uname: username })
    .andWhere('(p.photoOpis is null or p.photoOpis like :type)', { type: `%${PhotoTypes.PROFILE}%` })
    .getOne();
  }
  findProfilePhotoByUsername(username:string) {
    return this.usersRepository.createQueryBuilder('u')
    .leftJoinAndSelect("u.photo","p")
    .where('u.username = :uname', { uname: username})
    .andWhere('p.photoOpis like :type', { type: `%${PhotoTypes.PROFILE}%` })
    .getOne();
  }

  async handleSaveLocation(locationData:Location, user:any) {
    if(locationData.place_id) {
      let location = new Location();
      location.place_id = locationData.place_id;
      location.boundingbox = locationData.boundingbox;
      location.class = locationData.class;
      location.display_name = locationData.display_name;
      location.lat = locationData.lat;
      location.lon = locationData.lon;
      location.type = locationData.type;
      await this.locationService.getRepo().save(location);
      return location;
    }
  }
  async deleteOldLocation(PkLocation) {
    return this.locationService.getRepo().remove(await this.locationService.getRepo().createQueryBuilder('l').where('PkLocation = :pk', { pk: PkLocation }).getOne()); 
  }
}