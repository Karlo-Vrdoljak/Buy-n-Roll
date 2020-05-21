export interface User {
  userId: number;
  firstName: string;
  password: string;
  lastName: string;
  username: string;
  isActive: boolean;
  userCode:string;
  createdAt:Date;
  roles: Role[];

}

export class Role {
  PkRole: number;
  name: string;
  user: User;
}