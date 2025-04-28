import { RegisterDto } from '../../DTOs/register.dto';
import { LoginDto } from '../../DTOs/login.dto';

export interface AuthServiceInterface {
  handleRegister(registerRequest: RegisterDto): Promise<{ message: string }>;

  handleLogin(
    loginRequest: LoginDto,
  ): Promise<{ message: string; access_token: string, refresh_token: string }>;
}
