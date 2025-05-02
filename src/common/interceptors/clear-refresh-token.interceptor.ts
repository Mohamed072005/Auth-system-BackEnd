import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class ClearRefreshTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof UnauthorizedException){
          response.clearCookie('refresh_token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
          })
        }
        return throwError(() => error);
      })
    );
  }
}
