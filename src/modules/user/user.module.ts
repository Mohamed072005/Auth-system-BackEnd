import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entity/user.entity';
import { UserRepository } from './user.repository';
import { HashService } from '../../common/services/hash.service';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'HashServiceInterface',
      useClass: HashService,
    },
  ],
  exports: ['UserRepositoryInterface', 'UserServiceInterface', "HashServiceInterface"],
})
export class UserModule {}
