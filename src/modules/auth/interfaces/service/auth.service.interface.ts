import { RegisterDto } from '../../DTOs/register.dto';

export interface AuthServiceInterface {
  handleRegister(registerRequest: RegisterDto): Promise<{ message: string }>;
}
