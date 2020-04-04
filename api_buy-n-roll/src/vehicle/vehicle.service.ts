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
import { TrimService } from './trim/trim.service';
import { cars } from '../assets/static/cars';
import { Manufacturer } from 'src/entity/manufacturer.entity';
import { Series } from 'src/entity/series.entity';
import { Model } from 'src/entity/model.entity';
import { concat, of } from 'rxjs';
import { Connection } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

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
    public trimService: TrimService,
    public httpService: HttpService,
    public dbLogs: DbLogs,
    public connection: Connection,
  ) {}
  // concat(of (Object.keys(COLORS).map(key => this.colorRepository.save( { color:key,colorCode:COLORS[key]} )))).subscribe(val => this.dbLogs.vehicleColorInit());
  onModuleInit() {
    this.manufacturerService.count().then(count => {
      if (count == 0) {
        this.dbLogs.warnNeedsInit('Vehicle');
        this.dbLogs.initializing(0);

        this.saveManufacturerData().then(() => {
          this.dbLogs.initializing(33);

          this.manufacturerService
            .findAll()
            .then((manufacturers: Manufacturer[]) => {
              let carsByManufacturer = this.groupByKey(cars, 'MAKER');
              this.saveSeriesData(manufacturers, carsByManufacturer);
              this.dbLogs.initializing(66);

              this.getAllManufacturerSeries().then(result => {
								this.saveModelsToSeries(result[0]); // manufacturerSeries
								this.dbLogs.initializing(66);

              });
            });
        });
      }
    });
  }

  saveModelsToSeries(manufacturerSeries) {
    let Makergroup = this.groupByKey(cars, 'MAKER');
    let modelList = (Object.keys(Makergroup).map(makerGroupKey => {
      return {
				[makerGroupKey]: this.groupByKey(Makergroup[makerGroupKey], 'MODEL')
			}
		}));
		
		// console.log(modelList.find(x => x["VOLKSWAGEN"])["VOLKSWAGEN"]["Tiguan"]);
    manufacturerSeries.map(ms => {
			ms.series.map(async (s: Series) => {
				// console.log( ms.manufacturerName, s.seriesName);
				
				// // if(modelList.find) {
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

  // async getSerie($name) {
  // 	return await this.seriesService
  // 	.getRepo()
  // 	.createQueryBuilder('series')
  // 	.where("series.seriesName = :name", {name: $name})
  // 	.getMany();
  // }
  async getAllManufacturerSeries() {
    return await this.manufacturerService
			.getRepo()
			.createQueryBuilder('manufacturer')
			.leftJoinAndSelect('manufacturer.series', 'serie', 'serie.manufacturer')
      .getManyAndCount();
  }

  async saveManufacturerData() {
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

  saveSeriesData(manufacturers: Manufacturer[], manufacturerList) {
    manufacturers.map(async (manufacturer: Manufacturer) => {
      let seriesList = this.groupByKey(
        manufacturerList[manufacturer.manufacturerName],
        'MODEL',
      );
      // console.log(seriesList);

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

  groupByKey(array: any[], key) {
    return array.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }
}
