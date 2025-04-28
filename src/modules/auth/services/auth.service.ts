import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthServiceInterface } from '../interfaces/service/auth.service.interface';
import { RegisterDto } from '../DTOs/register.dto';
import { UserRepositoryInterface } from '../../user/interfaces/repository/user.repository.interface';
import { PasswordServiceInterface } from '../interfaces/service/password.service.interface';
import { LoginDto } from '../DTOs/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserServiceInterface } from '../../user/interfaces/service/user.service.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('UserRepositoryInterface')
    private userRepository: UserRepositoryInterface,
    @Inject('PasswordServiceInterface')
    private passwordService: PasswordServiceInterface,
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
    private readonly jwtService: JwtService,
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

  async handleLogin(
    loginRequest: LoginDto,
  ): Promise<{ message: string; access_token: string; refresh_token: string }> {
    const user = await this.userRepository.findUserByEmail(loginRequest.email);
    if (!user) throw new NotFoundException('User not found');
    const comparePassword = await this.passwordService.comparePassword(
      loginRequest.password,
      user.password,
    );

    if (!comparePassword) throw new BadRequestException('Invalid Credentials');

    const payload = { user_name: user.name, sub: user._id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    await this.userService.setUserRefreshToken(refreshToken, user._id);

    return {
      refresh_token: refreshToken,
      access_token: accessToken,
      message: 'Login successfully',
    };
  }
}
