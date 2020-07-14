import { UserVehicle } from "./manufacturer.interface";

export interface Oglas {
  PkOglas: number;
  oglasNaziv: string;
  oglasOpis: string;
  oglasCreatedAt: Date;
  lastModified: Date;
  vehicle: UserVehicle;
  rating: number;
  views: number;
  priceMainCurrency: string;
  priceSubCurrency: string;
  currencyName: string;
  paymentMethod: PaymentMethod;
  autoRadioDefs: string;
  safety: string;
  accessories: string;
  theftSafety: string;
  airConditioning: string;
  comfortAccessories: string;
}

export class Photo {
  PkPhoto: number;
  photoTitle: string; 
  photoOpis: string; 
  photoCreatedAt: string;
  fieldname: string;
  originalname: string
  encoding: string;
  mimetype: string;
  destination: string
  filename: string;
  path: string;
  size: number;
  oglasPkOglas?: number;
}
export enum SellerType {
  PRIVATNA_OSOBA = 'PRIVATNA_OSOBA',
  PODUZECE = 'PODUZECE'
}

export enum VehicleState {
  IZVRSNO = "IZVRSNO",
  UREDNO = "UREDNO",
  DOBRO = "DOBRO",
  RABLJENO = "RABLJENO",
  LOSIJE = "LOSIJE",
  DIJELOVI = "DIJELOVI",
  LOSE = "LOSE",
  KARAMBOLIRAN = "KARAMBOLIRAN"
}

export enum PaymentMethod {
  GOTOVINA = "GOTOVINA",
  KARTICNO = "KARTICNO",
  NA_RATE = "NA_RATE",
  ZAMJENA = "ZAMJENA"
}