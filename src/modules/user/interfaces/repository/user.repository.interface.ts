import { User } from '../../entity/user.entity';
import { RegisterDto } from '../../../auth/DTOs/register.dto';

export interface UserRepositoryInterface {
  findUserByEmail(email: string): Promise<User>;

  createUser(registerData: RegisterDto): Promise<void>;
}
