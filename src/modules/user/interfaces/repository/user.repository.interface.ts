import { User, UserDocument } from '../../entity/user.entity';
import { RegisterDto } from '../../../auth/DTOs/register.dto';
import { Types } from 'mongoose';

export interface UserRepositoryInterface {
  findUserByEmail(email: string): Promise<UserDocument>;

  createUser(registerData: RegisterDto): Promise<void>;

  updateUser(
    user_id: Types.ObjectId,
    propertiesForUpdate: Record<string, string>,
  ): Promise<void>;

  getUserById(user_id: Types.ObjectId): Promise<UserDocument>;
}
