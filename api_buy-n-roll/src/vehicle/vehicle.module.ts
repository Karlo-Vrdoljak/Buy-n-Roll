import { Module, HttpModule } from '@nestjs/common';
import { BodyModule } from './body/body.module';
import { ChassisModule } from './chassis/chassis.module';
import { ColorModule } from './color/color.module';
import { DrivetrainModule } from './drivetrain/drivetrain.module';
import { GasTypeModule } from './gasType/gasType.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { ModelModule } from './model/model.module';
import { SeriesModule } from './series/series.module';
import { TransmissionModule } from './transmission/transmission.module';
import { VehicleService } from './vehicle.service';
import { DbLogs } from 'src/db.logs';
import { Connection } from 'typeorm/connection/Connection';
import { SearchController } from 'src/controllers/vehicle/search/search.controller';
import { DBAccess } from 'src/types/db.access';
import { OglasModule } from 'src/users/oglas/oglas.module';
import { Config } from 'src/config';
import { FavouritesModule } from 'src/users/oglas/favourites/favourites.module';

@Module({
  imports: [
    BodyModule,
    ChassisModule,
    ColorModule,
    DrivetrainModule,
    GasTypeModule,
    ManufacturerModule,
    ModelModule,
    SeriesModule,
    TransmissionModule,
    HttpModule,
    OglasModule,
    FavouritesModule
  ],
  exports: [
    BodyModule,
    ChassisModule,
    ColorModule,
    DrivetrainModule,
    GasTypeModule,
    ManufacturerModule,
    ModelModule,
    SeriesModule,
    TransmissionModule,
    HttpModule,
    DbLogs,
    VehicleService,
    OglasModule,
    FavouritesModule
  ],
  controllers: [SearchController],
  providers: [
    VehicleService,
    DbLogs,
    DBAccess,
    Config
  ]
})
export class VehicleModule {private readonly connection: Connection}
