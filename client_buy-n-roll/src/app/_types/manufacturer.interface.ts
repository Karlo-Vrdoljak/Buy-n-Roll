import { User } from './user.interface';

export interface Manufacturer {
  PkManufacturer: number;
  manufacturerName: string;
  series: Series[];
}
export interface Series {
  PkSeries: number;
  seriesName: string; // 'astra' 
  manufacturer: Manufacturer;
  models: Model[];
}

export interface Model {
  PkModel: number;
  modelName: string; // 'F/G/H E46...' 
  endOfProductionYear: string;
  drivetrains: Drivetrain[];
  trims: Trim[];
  transmission: Transmission;
  gasType: string;
  body: Body;
  chassisList: Chassis[];
  series: Series;
}

export interface Drivetrain {
  PkDrivetrain: number;
  drivetrainName: string; // 'Front wheel drive'
  drivetrainCode: string; // 'FWD | AWD | RWD' 
  model: Model;
} 

export interface Trim {
  PkTrim: number;
  trimName: string; // 'GLS, GSi'
  trimCode: string; // 'FWD | AWD | RWD' 
  model: Model;
} 

export interface Transmission {
  PkTransmission: number;
  transmissionName: string; // 'Automatic, Manual'

} 

export interface Chassis {
  PkChassis: number;
  makeYear: string; 
  VIN: string;
  color: Color;
  model: Model;

}
export interface Color {
  PkColor: number;
  colorCode: string; // z20r etc
  color: string; // blue, red, black...
  chassisList: Chassis[];

}

export interface Body {
  PkBody: number;
  BodyName: string; // 'sedan, hatchback, limuzina'

} 
export interface GasType {
  PkGasType: number;
  gasType: string; // 'benzinac, dizelas, lpg'

} 

export interface UserVehicle {
  PkUserVehicle: number;
  user: User;
  chassis: Chassis;
  RegistriranDaNe: boolean;

}
