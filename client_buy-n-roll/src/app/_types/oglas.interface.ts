import { UserVehicle } from './manufacturer.interface';

export interface Oglas {
  PkOglas: number;
  oglasNaziv: string; // 'Astra f gsi prvi vlasnik'
  oglasOpis: string; // 'free text opis' 
  oglasCreatedAt:Date;
  lastModified:Date;
  photos: Photo[];
  vehicle: UserVehicle;
  rating:number;
  views:number;
} 

export class Photo {
  PkPhoto: number;
  photoTitle: string; // 'Astra f gsi prvi vlasnik'
  photoOpis: string; // 'free text opis' 
  photoCreatedAt:Date;
  oglas: Oglas;

} 
