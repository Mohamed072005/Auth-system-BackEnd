import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class RefreshTokenGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['refresh_token'];

    if(refreshToken === '' || !refreshToken) {
      throw new UnauthorizedException('refresh token is missing');
    }
    try {
      const payload = await this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET
      });
      request.user = {
        user_id: payload.sub,
      }
      return true;
    }catch(err) {
      throw new UnauthorizedException('refresh token is invalid');
    }

  }
}