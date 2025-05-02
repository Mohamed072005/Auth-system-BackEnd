import { RegisterDto } from '../../DTOs/register.dto';
import { LoginDto } from '../../DTOs/login.dto';
import { Response } from 'express';

export interface AuthServiceInterface {
  handleRegister(registerRequest: RegisterDto): Promise<{ message: string }>;

  handleLogin(
    loginRequest: LoginDto,
  ): Promise<{ message: string; access_token: string, refresh_token: string }>;

  refreshTokens(refreshToken: string, user_id: string, response: Response): Promise<void>;
}
