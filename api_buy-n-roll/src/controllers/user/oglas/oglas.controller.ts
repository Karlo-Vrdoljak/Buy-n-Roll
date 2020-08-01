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
import { VehicleState } from 'src/types/enums';
import { Like } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { ModuleRef } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { Comments } from 'src/entity/comments.entity';
import { Photo } from 'src/entity/photo.entity';
import { Duplex } from 'stream';

@Controller('api/')
export class OglasController {
  constructor(private oglasService:OglasService, private moduleRef:ModuleRef) { }
  auth: AuthService;
  onModuleInit() {
    this.auth = this.moduleRef.get(AuthService, {strict:false});
  }
  @Get('oglas/:query')
  async getOglasiBySearchString(@Param() params, @Request() req, @Res() res: Response) {
    let oglas = await this.oglasService.findOglasByPk(params.query);
    if(oglas) {
      if(req.headers?.authorization?.split('Bearer ')) {
        let token = req.headers.authorization.split('Bearer ')[1];
        let user = this.auth.decodeToken(token);
        oglas = await this.oglasService.checkFavourite(oglas, user.sub);
      } else {
        oglas = await this.oglasService.checkFavourite(oglas, null);
      }

      let comments = await this.oglasService.findOglasComments(params.query);
      oglas['commentTree'] = comments;
      res.status(HttpStatus.OK).send(oglas);
    } else {
      res.status(HttpStatus.FAILED_DEPENDENCY).send();
    }
  }


  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('user')
  @Post('oglas/add/comment')
  async addComment(@Request() req, @Res() res: Response) {
    let targetNode = req.body.nodeId ? await this.oglasService.getConnection().getRepository(Comments).createQueryBuilder('c')
    .where('c.id = :pk', {pk: req.body.nodeId})
    .getOne() : null;

      let node = new Comments();
    node.comment = req.body.komentar;
    node.parent = targetNode;
    node.oglas = await this.oglasService.findOglasByPk(req.body.pkOglas);
    node.user = await this.oglasService.getConnection().createQueryBuilder(User, 'u')
      .where('u.userId = :pk', {pk: req.body.userId}).getOne();
    node.userId = req.body.userId;
    await this.oglasService.getConnection().getRepository(Comments).save(node);
    
    let comments = await this.oglasService.findOglasComments(req.body.pkOglas);

    res.status(HttpStatus.CREATED).send(comments);
  }

  
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('user')
  @Post('oglas/delete/comment')
  async deleteComment(@Request() req, @Res() res: Response) {
    let targetNode = await this.oglasService.getConnection().getRepository(Comments).createQueryBuilder('c')
      .where('c.id = :pk', {pk: req.body.nodeId})
      .getOne();
      targetNode.comment = 'deleted.';
    await this.oglasService.getConnection().getRepository(Comments).save(targetNode);
    let comments = await this.oglasService.findOglasComments(req.body.pkOglas);

    res.status(HttpStatus.CREATED).send(comments);

  }


  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('user')
  @Post('oglas/insert')
  async insertNewOglas(@Request() req, @Res() res: Response) {
    const dbUserVehicle = new UserVehicle();
    
    dbUserVehicle.RegistriranDaNe = req.body.registriranDaNe;

    let chassis = new Chassis();

    let model = await this.oglasService.getConnection()
      .createQueryBuilder(Model,'m')
      .where('m.PkModel = :PkModel', { PkModel: req.body.selectedModel.PkModel })
      .getOne();

    let drivetrain = await  this.oglasService.getConnection()
      .createQueryBuilder(Drivetrain,'dt')
      .where('dt.PkDrivetrain = :pk', { pk: req.body.selectedDrivetrain.PkDrivetrain })
      .getOne();

    let gas = await  this.oglasService.getConnection()
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

    let color = await this.oglasService.getConnection()
    .createQueryBuilder(Color,'c')
    .where('c.PkColor = :pkColor', { pkColor: req.body.selectedColor.PkColor })
    .getOne();

    chassis.makeYear = req.body.makeYear;
    chassis.color = color;
    chassis.kilometers = req.body.kilometers;
    chassis.consumption = req.body.consumption;
    chassis.vehicleState = req.body.vehicleState;
    chassis.VIN = req.body.vin;

    
    await this.oglasService.getConnection().getRepository(Chassis).save(chassis);

    dbUserVehicle.chassis = chassis;

    dbUserVehicle.user = await this.oglasService.getConnection().getRepository(User).findOne({
      userId: req.user.userId
    });
    
    await this.oglasService.getConnection().getRepository(UserVehicle).save(dbUserVehicle);

    let oglas = new Oglas();
    oglas.oglasNaziv = req.body.oglasNaziv;
    oglas.oglasOpis = req.body.oglasOpis;
    oglas.vehicle = dbUserVehicle;
    oglas.accessories = req.body.accessories;
    oglas.airConditioning = req.body.airConditioning;
    oglas.comfortAccessories = req.body.comfortAccessories;
    oglas.currencyName = req.body.currencyName.name;
    oglas.paymentMethod = req.body.paymentMethod;
    oglas.priceMainCurrency = req.body.priceMainCurrency;
    oglas.priceSubCurrency = req.body.priceSubCurrency;
    oglas.safety = req.body.safety;
    oglas.theftSafety = req.body.theftSafety;
    oglas.autoRadioDefs = req.body.autoRadioDefs;

    if(req.body.location) {
      oglas.location = await this.oglasService.handleSaveLocation(req.body.location);
    }

    let resOglas = await this.oglasService.getRepo().save(oglas);

    res.status(HttpStatus.OK).send(resOglas);
    
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('user')
  @Post('oglas/edit/saveChanges')
  async saveChanges(@Request() req, @Res() res: Response) {
    let oglas = await this.oglasService.findOglasByPk(req.body.PkOglas);
    
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

    res.status(HttpStatus.OK).send(chassis);
    
  }

  @Post('kupoprodajni')
  async generatePdf(@Request() req, @Res() res: Response) {
    const doc = await this.oglasService.generateKupoprodajni({PkOglas: req.body.PkOglas, kupacId: req.body.kupacId, prodavacId: req.body.prodavacId});
    
    let stream = new Duplex();
    stream.push(doc);
    stream.push(null);
    res.setHeader('Content-Type', 'application/pdf');
    stream.pipe(res);
  }
}
