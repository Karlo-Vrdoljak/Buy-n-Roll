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
import { TrimModule } from './trim/trim.module';
import { VehicleService } from './vehicle.service';
import { DbLogs } from 'src/db.logs';
import { Connection } from 'typeorm/connection/Connection';

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
    TrimModule,
    HttpModule,
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
    TrimModule,
    HttpModule,
    DbLogs
  ],
  providers: [
    VehicleService,
    DbLogs
  ]
})
export class VehicleModule {private readonly connection: Connection}
