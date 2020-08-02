import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import { DbLogs } from 'src/db.logs';
import { BodyService } from './body/body.service';
import { ChassisService } from './chassis/chassis.service';
import { ColorService } from './color/color.service';
import { DrivetrainService } from './drivetrain/drivetrain.service';
import { GasTypeService } from './gasType/gasType.service';
import { ManufacturerService } from './manufacturer/manufacturer.service';
import { ModelService } from './model/model.service';
import { SeriesService } from './series/series.service';
import { TransmissionService } from './transmission/transmission.service';
import { cars } from '../assets/static/cars';
import { Manufacturer } from 'src/entity/manufacturer.entity';
import { Series } from 'src/entity/series.entity';
import { Model } from 'src/entity/model.entity';
import { concat, of } from 'rxjs';
import { Connection } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as COLORS from '../assets/static/color-names.json';
import * as GAS_TYPE from '../assets/static/gasTypes.json';
import * as BODY from '../assets/static/body.json';
import * as TRANSMISSION from '../assets/static/transmission.json';
import * as DRIVETRAIN from '../assets/static/drivetrain.json';
import { DBAccess } from 'src/types/db.access';
import { OglasService } from 'src/users/oglas/oglas.service';


@Injectable()
export class VehicleService implements OnModuleInit {

  constructor(
    public bodyService: BodyService,
    public chassisService: ChassisService,
    public colorService: ColorService,
    public drivetrainService: DrivetrainService,
    public gasTypeService: GasTypeService,
    public manufacturerService: ManufacturerService,
    public modelService: ModelService,
    public seriesService: SeriesService,
    public transmissionService: TransmissionService,
    public httpService: HttpService,
    public dbLogs: DbLogs,
    public connection: Connection,
    public dbAccess: DBAccess,
    public oglasService: OglasService
  ) {}
  onModuleInit() {

    this.colorService.count().then(count => {
			if(count == 0) {
        concat(of (Object.keys(COLORS).map(key => this.colorService.getRepo().save( { color:key,colorCode:COLORS[key]} )))).subscribe(val => this.dbLogs.successInit('color'));
      }
    });
    this.gasTypeService.count().then(count => {
      if(count == 0) {
        // concat(of (Object.keys(GAS_TYPE).map(key => this.colorService.getRepo().save( { color:key,colorCode:COLORS[key]} )))).subscribe(val => this.dbLogs.successInit('color'));
        concat(of (GAS_TYPE.map(gt => this.gasTypeService.getRepo().save( { gasType: gt.vrstaGoriva } ))));
      }
    });

    this.bodyService.count().then(count => {
      if(count == 0) {
        // concat(of (Object.keys(GAS_TYPE).map(key => this.colorService.getRepo().save( { color:key,colorCode:COLORS[key]} )))).subscribe(val => this.dbLogs.successInit('color'));
        concat(of (BODY.map(b => this.bodyService.getRepo().save( { bodyName: b.body } ))));
      }
    });

    this.transmissionService.count().then(count => {
      if(count == 0) {
        concat(of (TRANSMISSION.map(t => this.transmissionService.getRepo().save( { transmissionName: t.transmission } ))));
      }
    });

    this.drivetrainService.count().then(count => {
      if(count == 0) {
        concat(of (DRIVETRAIN.map(d => this.drivetrainService.getRepo().save( { drivetrainCode: d.drivetrain } ))));
      }
    });

    this.manufacturerService.count().then(count => {
      if (count == 0) {
        this.dbLogs.warnNeedsInit('Vehicle');
        this.dbLogs.initializing(0);

        this._saveManufacturerData().then(() => {
          this.dbLogs.initializing(33);

          this.manufacturerService
            .findAll()
            .then((manufacturers: Manufacturer[]) => {
              let carsByManufacturer = this._groupByKey(cars, 'MAKER');
              this._saveSeriesData(manufacturers, carsByManufacturer);
              this.dbLogs.initializing(66);

              this._getAllManufacturerSeries().then(result => {
								this._saveModelsToSeries(result[0]); // manufacturerSeries
								this.dbLogs.initializing(87);

              });
            });
        });
      }
    });
  }

  private _saveModelsToSeries(manufacturerSeries) {
    let Makergroup = this._groupByKey(cars, 'MAKER');
    let modelList = (Object.keys(Makergroup).map(makerGroupKey => {
      return {
				[makerGroupKey]: this._groupByKey(Makergroup[makerGroupKey], 'MODEL')
			}
		}));
		
    manufacturerSeries.map(ms => {
			ms.series.map(async (s: Series) => {
				
					let models = modelList.find(m => m[ms.manufacturerName])[ms.manufacturerName][s.seriesName].map(model => {
						return {
							series: s,
							modelName: model.FULLMODELNAME,
							endOfProductionYear: model['PRODUCTION END'],
						} as Model;
					});
					await this.connection
          .createQueryBuilder()
          .insert()
          .into(Model)
          .values(models)
					.execute();
				// }
      });
    });
  }

  private async _getAllManufacturerSeries() {
    return await this.manufacturerService
			.getRepo()
			.createQueryBuilder('manufacturer')
			.leftJoinAndSelect('manufacturer.series', 'serie', 'serie.manufacturer')
      .getManyAndCount();
  }

  private async _saveManufacturerData() {
    let uniqueManufacturers = cars
      .map(car => car.MAKER)
      .filter((item, pos, self) => {
        return self.indexOf(item) == pos;
      });
    let manufacturerList = uniqueManufacturers.map(manufacturer => {
      return {
        manufacturerName: manufacturer,
      } as Manufacturer;
    });
    await this.connection
      .createQueryBuilder()
      .insert()
      .into(Manufacturer)
      .values(manufacturerList)
      .execute();
    return manufacturerList;
  }

  private _saveSeriesData(manufacturers: Manufacturer[], manufacturerList) {
    manufacturers.map(async (manufacturer: Manufacturer) => {
      let seriesList = this._groupByKey(
        manufacturerList[manufacturer.manufacturerName],
        'MODEL',
      );

      await this.connection
        .createQueryBuilder()
        .insert()
        .into(Series)
        .values(
          Object.keys(seriesList).map(key => {
            return {
              manufacturer: manufacturer,
              seriesName: key,
              // models: seriesList[key].map(model => {

              // 	return  {
              // 		modelName: model.FULLMODELNAME,
              // 		endOfProductionYear: model['PRODUCTION END']
              // 	}as Model;
              // })
            } as Series;
          }),
        )
        .execute();
    });
  }

  private _groupByKey(array: any[], key) {
    return array.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  findOglasiBySearchString(searchString:string) {
    return this.oglasService.getRepo().query(this.dbAccess.getOglasSearchByString(), new Array(18).fill(searchString));
  }
  // findOglasiAll() {
  //   return this.oglasService.getRepo().query(this.dbAccess.getOglasAll());
  // }
  findOglasiBySimpleProps(props: Manufacturer & Series & Model) {
    return this.oglasService.getRepo().query(this.dbAccess.getOglasSearchByString(), [props.seriesName, props.manufacturerName, null, null, props.modelName, null, null, null, null, props.seriesName, props.manufacturerName, null, null, props.modelName, null, null, null, null]);
  }
  findOglasiByAllProps(props:any) {
    for (const [key, value] of Object.entries(props)) {
      props[key] = props[key] == 'null' ? null : props[key];
    }
    let kilometri = [];
    if(props.kilometri) {
      kilometri = props.kilometri.split(',');
    }
    let godina = [];
    if(props.godina) {
      godina = props.godina.split(',');
    }
    let potrosnja = [];
    if(props.potrosnja) {
      potrosnja = props.potrosnja.split(',');
    }
    
    return this.oglasService.getRepo().query(this.dbAccess.getOglasSearchAdvanced(), [
      props.seriesName,
      props.manufacturerName,
      props.modelName,
      props.bodyName,
      props.gasType,
      props.transmissionName,
      props.drivetrainCode,
      props.seriesName,
      props.seriesName,
      props.manufacturerName,
      props.manufacturerName,
      props.modelName,
      props.modelName,
      props.bodyName,
      props.bodyName,
      props.gasType,
      props.gasType,
      props.transmissionName,
      props.transmissionName,
      props.drivetrainCode,
      props.drivetrainCode,
      props.color,
      props.color,
      props.vehicleState,
      props.vehicleState,
      potrosnja[0],
      potrosnja[0],
      potrosnja[1],
      kilometri[0],
      kilometri[0],
      kilometri[1],
      godina[0],
      godina[0],
      godina[1]
    ]);
    
  }
}

