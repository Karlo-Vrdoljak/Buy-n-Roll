import { SellerType, Photo } from './oglas.interface';

export interface User {
  userId: number;
  firstName: string;
  password: string;
  lastName: string;
  passwordCheck?: string;
  username: string;
  isActive: boolean;
  userCode:string;
  createdAt:Date;
  roles: Role[];
  phone: string;
  email: string;
  sellerType:SellerType;
  photo?:Photo;
  location:any;
}

export class Role {
  PkRole: number;
  name: string;
  user: User;
}