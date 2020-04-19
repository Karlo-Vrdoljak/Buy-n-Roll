import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    let dbUser = await this.usersService.getUserRepo()
    .createQueryBuilder('u')
    .leftJoinAndSelect('u.roles', 'r')
    .where('u.username = :username', { username: user.username })
    .getOne();
    const payload = { username: dbUser.username, sub: dbUser.userId, roles: dbUser.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
