import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entity/user.entity';
import { ErrorMessages } from 'src/types/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    
    const user = await this.usersService.findOne(username);
    if (user) {
      let hash =  await this.usersService.getHash(pass);
      if(await this.usersService.compareHash(pass, user.password)){
        const { password, ...result } = user;
        return result;
      }
    } 
    return null;
  }

  async login(user: User) {
    let dbUser = await this.usersService.getUserRepo()
    .createQueryBuilder('u')
    .leftJoinAndSelect('u.roles', 'r')
    .where('u.username = :username', { username: user.username })
    .getOne();
    if(dbUser == undefined) {
      return { errMsg: ErrorMessages.userNotFound };
    }
    if(!user.password) {
      return { errMsg: ErrorMessages.wrongPassword };
    }
    let result = await this.validateUser(dbUser.username, user.password);
    if(result == null) {
      return { errMsg: ErrorMessages.wrongPassword };
    }
    const payload = { username: dbUser.username, sub: dbUser.userId, roles: dbUser.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
