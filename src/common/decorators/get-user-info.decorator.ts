import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfo } from '../types/user-info.type';

export const GetUserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserInfo => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
)