import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { AuthServiceInterface } from '../interfaces/service/auth.service.interface';
import { RegisterDto } from '../DTOs/register.dto';
import { UserRepositoryInterface } from '../../user/interfaces/repository/user.repository.interface';
import { PasswordServiceInterface } from '../interfaces/service/password.service.interface';
import { LoginDto } from '../DTOs/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserServiceInterface } from '../../user/interfaces/service/user.service.interface';
import { jwtConstants } from '../constants';
import { Response } from 'express';
import { toMongoObjectIdTransformer } from '../../../common/transformers/to-mongo-object-id.transformer';
import { HashServiceInterface } from '../../../common/interfaces/services/hash.service.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('UserRepositoryInterface')
    private userRepository: UserRepositoryInterface,
    @Inject('PasswordServiceInterface')
    private passwordService: PasswordServiceInterface,
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
    @Inject('HashServiceInterface')
    private readonly hashService: HashServiceInterface,
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

    const accessToken = await this.generateToken(payload, jwtConstants.accessTokenSecret, '15m');

    const refreshToken = await this.generateToken(payload, jwtConstants.refreshTokenSecret, '7d');

    await this.userService.setUserRefreshToken(refreshToken, user._id);

    return {
      refresh_token: refreshToken,
      access_token: accessToken,
      message: 'Login successfully',
    };
  }

  async refreshTokens(refreshToken: string, user_id: string, response: Response): Promise<void> {
    const userObjectId = toMongoObjectIdTransformer(user_id);
    const user = await this.userRepository.getUserById(userObjectId);
    if (!user) throw new UnauthorizedException('User not found');
    const verifyRefreshToken = await this.hashService.compareClaims(refreshToken, user.refresh_token);
    if (!verifyRefreshToken) throw new UnauthorizedException('refresh token is invalid');
  }
  
  private async generateToken(payload: any, secret: string, expiresIn: string) {
    return await this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }
}
