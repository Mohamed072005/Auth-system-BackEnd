import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { PasswordService } from './services/password.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { HashService } from '../../common/services/hash.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: false,
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService,
    },
    {
      provide: 'PasswordServiceInterface',
      useClass: PasswordService,
    },
    {
      provide: 'HashServiceInterface',
      useClass: HashService,
    },
  ],
})
export class AuthModule {}
