import { PasswordServiceInterface } from '../interfaces/service/password.service.interface';
import * as bcrypt from 'bcryptjs';

export class PasswordService implements PasswordServiceInterface {
  async hashedPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
