import { Types } from 'mongoose';

export interface UserServiceInterface {
  setUserRefreshToken(
    refreshToken: string,
    user_id: Types.ObjectId,
  ): Promise<void>;
}
