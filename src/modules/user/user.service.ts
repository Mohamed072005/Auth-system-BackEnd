import { Inject, Injectable } from '@nestjs/common';
import { UserServiceInterface } from './interfaces/service/user.service.interface';
import { UserRepositoryInterface } from './interfaces/repository/user.repository.interface';
import { Types } from 'mongoose';
import { HashService } from '../../common/services/hash.service';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    private readonly hashService: HashService,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async setUserRefreshToken(
    refreshToken: string,
    user_id: Types.ObjectId,
  ): Promise<void> {
    const hashRefreshToken = await this.hashService.hashClaims(refreshToken);
    await this.userRepository.updateUser(user_id, {
      refresh_token: hashRefreshToken,
    });
  }
}
