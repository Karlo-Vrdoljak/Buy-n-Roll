import { Controller, UseGuards, Post, Request, Res } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req, @Res() res: Response) {
    let auth = await this.authService.login(req.body);
    if (!auth.errMsg) {
      res.status(200).send(auth);
    } else {
      res.status(401);
      res.statusMessage = auth.errMsg;
      res.end();
    }
  }

  @Post('/check')
  async checkJwt(@Request() req, @Res() res:Response) {
    let decoded = await this.jwtService.verifyAsync(req.body.jwt).catch((err:Error) => {
      res.status(401).send(err.message);
    });
    res.send(decoded);
  }
}
