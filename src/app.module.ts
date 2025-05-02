import { Module } from '@nestjs/common';
import { UserService } from './modules/user/user.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
  providers: [UserService],
})
export class AppModule {}
