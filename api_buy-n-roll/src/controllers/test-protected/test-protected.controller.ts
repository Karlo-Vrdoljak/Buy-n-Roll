import { Controller, UseGuards, Get, Request, SetMetadata } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('api/test/protected/')
export class TestProtectedController {
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('admin')
  @Get()
  testProtected(@Request() req) {
    return [
      req.user,
      {
        title: 'JWT',
        value: 'test',
      },
    ];
  }
}
