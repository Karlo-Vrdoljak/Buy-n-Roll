import { Controller, Get, Param, Res, Request, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { OglasService } from 'src/users/oglas/oglas.service';
import { Oglas } from 'src/entity/oglas.entity';
import { Response } from 'express';
import * as fs from "fs";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Color } from 'src/entity/color.entity';
import { Model } from 'src/entity/model.entity';
import { Drivetrain } from 'src/entity/drivetrain.entity';
import { GasType } from 'src/entity/gasType.entity';
import { Transmission } from 'src/entity/transmission.entity';
import { Body } from 'src/entity/body.entity';
import { UserVehicle } from 'src/entity/userVehicle.entity';
import { Chassis } from 'src/entity/chassis.entity';

@Controller('api/oglas/')
export class OglasController {
  constructor(private oglasService:OglasService) { }
  
  @Get(':query')
  async getOglasiBySearchString(@Param() params, @Res() res: Response) {
    let oglas = await this.oglasService.findOglasByPk(params.query);
    if(oglas) {
      res.status(HttpStatus.OK).send(oglas);
    } else {
      res.status(HttpStatus.FAILED_DEPENDENCY).send();
    }
  }

  @Get()
  async get(): Promise<Oglas> {
    let oglas = await this.oglasService.getRepo().findOne(1);
    console.log(oglas);
    oglas.oglasOpis = `Prodaje se Opel Astra 1.8 16V
    cijena je ta zbog odlaska u inozemstvo...
    sportsko podvozje
    atestirani branici
    atestiran plin
    zadnja slika te felge su trenutno na njemu
    Astra nije registrirana,papiri uredni
    limarija u osrednjem stanju trebalo bi malo uložiti u nju...
    Najbitnije pali i vozi
    `;
    await this.oglasService.getRepo().save(oglas);
    return this.oglasService.getRepo().findOne(1);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('user')
  @Post('edit/saveChanges')
  async saveChanges(@Request() req, @Res() res: Response) {
    let oglas = await this.oglasService.findOglasByPk(req.body.PkOglas);
    console.log("DB_OGLAS", oglas);
    console.log("REQ_BODY",req.body);
    
    oglas.oglasNaziv = req.body.oglasNaziv;
    oglas.oglasOpis = req.body.oglasOpis;
    oglas.priceMainCurrency = req.body.priceMainCurrency;
    oglas.priceSubCurrency = req.body.priceSubCurrency;
    oglas.currencyName = req.body.currencyName.name;
    oglas.paymentMethod = req.body.paymentMethod;
    oglas.autoRadioDefs = req.body.autoRadioDefs;
    oglas.safety = req.body.safety;
    oglas.accessories = req.body.accessories;
    oglas.theftSafety = req.body.theftSafety;
    oglas.airConditioning = req.body.airConditioning;
    oglas.comfortAccessories = req.body.comfortAccessories;

    if(req.body.location) {
      oglas.location = await this.oglasService.handleSaveLocation(req.body.location);
    }
    await this.oglasService.getRepo().save(oglas);

    let vehicle = await this.oglasService.getConnection()
    .createQueryBuilder(UserVehicle,'uv')
    .where('uv.PkUserVehicle = :PkUserVehicle', { PkUserVehicle: req.body.PkVehicle })
    .getOne();
    vehicle.RegistriranDaNe = req.body.registriranDaNe;
    await this.oglasService.getConnection().getRepository(UserVehicle).save(vehicle);

    let chassis = await this.oglasService.getConnection()
    .createQueryBuilder(Chassis,'ch')
    .where('ch.PkChassis = :PkChassis', { PkChassis: req.body.PkChassis })
    .getOne();
    
    chassis.VIN = req.body.vin;
    chassis.color = await this.oglasService.getConnection().createQueryBuilder(Color,"c").where('c.PkColor = :pkColor', {pkColor: req.body.selectedColor.PkColor}).getOne();
    chassis.consumption = req.body.consumption;
    chassis.kilometers = req.body.kilometers;
    chassis.makeYear = req.body.makeYear;
    chassis.vehicleState = req.body.vehicleState;    

    let model = await this.oglasService.getConnection()
      .createQueryBuilder(Model,'m')
      .leftJoinAndSelect('m.series', 's')
      .leftJoinAndSelect('s.manufacturer','manuf')
      .where('m.PkModel = :pkModel', { pkModel: req.body.selectedModel.PkModel })
      .getOne();
    
    let drivetrain = await this.oglasService.getConnection()
      .createQueryBuilder(Drivetrain,'dt')
      .where('dt.drivetrainCode = :code', { code: req.body.selectedDrivetrain.drivetrainCode})
      .getOne();

    let gas = await this.oglasService.getConnection()
      .createQueryBuilder(GasType,'g')
      .where('g.gasType = :x', { x: req.body.selectedGasType.value })
      .getOne();
    
    let transmission = await this.oglasService.getConnection()
      .createQueryBuilder(Transmission,'t')
      .where('t.transmissionName = :tr', { tr: req.body.selectedTransmission.transmissionName })
      .getOne();

    let body = await this.oglasService.getConnection()
      .createQueryBuilder(Body,'b')
      .where('b.bodyName = :bname', { bname: req.body.selectedBody.bodyName })
      .getOne();
    
    chassis.drivetrain = drivetrain;
    chassis.gasType = gas;
    chassis.transmission = transmission;
    chassis.body = body;
    chassis.model = model;

    await this.oglasService.getConnection().getRepository(Chassis).save(chassis);

    // oglas.vehicle.chassis.model = model;

    // await this.oglasService.getRepo().save(oglas);

    // let result = await this.oglasService.findOglasByPk(req.body.PkOglas);

    res.status(HttpStatus.OK).send(chassis);
    
  }
}
