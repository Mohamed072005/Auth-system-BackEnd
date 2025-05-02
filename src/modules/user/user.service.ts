import { Inject, Injectable } from '@nestjs/common';
import { UserServiceInterface } from './interfaces/service/user.service.interface';
import { UserRepositoryInterface } from './interfaces/repository/user.repository.interface';
import { Types } from 'mongoose';
import { HashServiceInterface } from '../../common/interfaces/services/hash.service.interface';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @Inject('HashServiceInterface')
    private readonly hashService: HashServiceInterface,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async setUserRefreshToken(
    refreshToken: string,
    user_id: Types.ObjectId,
  ): Promise<void> {
    const hashRefreshToken = await this.hashService.hashClaims(refreshToken);
    console.log('setUserRefreshToken', user_id);
    await this.userRepository.updateUser(user_id, {
      refresh_token: hashRefreshToken,
    });
  }
}
