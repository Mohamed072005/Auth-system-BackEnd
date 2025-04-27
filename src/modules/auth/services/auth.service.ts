import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { AuthServiceInterface } from '../interfaces/service/auth.service.interface';
import { RegisterDto } from '../DTOs/register.dto';
import { UserRepositoryInterface } from '../../user/interfaces/repository/user.repository.interface';
import { PasswordServiceInterface } from '../interfaces/service/password.service.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('UserRepositoryInterface')
    private userRepository: UserRepositoryInterface,
    @Inject('PasswordServiceInterface')
    private passwordService: PasswordServiceInterface,
  ) {}

  async handleRegister(
    registerRequest: RegisterDto,
  ): Promise<{ message: string }> {
    const userExist = await this.userRepository.findUserByEmail(
      registerRequest.email,
    );
    if (userExist) {
      throw new ConflictException('User already exists');
    }

    const hashPassword = await this.passwordService.hashedPassword(
      registerRequest.password,
    );

    const userData = {
      ...registerRequest,
      password: hashPassword,
    };
    await this.userRepository.createUser(userData);

    return {
      message: 'Register successfully',
    };
  }
}
