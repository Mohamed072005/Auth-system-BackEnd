import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
  ) {
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if(!token) {
      throw new UnauthorizedException('access token is missing');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      request.user = {
        id: payload.sub,
        username: payload.username,
      };
      return true;
    }catch(err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Access token expired');
      }
      throw new UnauthorizedException('Invalid access token');
    }
  }

}

