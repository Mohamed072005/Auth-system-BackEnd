import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  async hashClaims(parametre: any): Promise<string> {
    return await bcrypt.hash(parametre.password, 10);
  }
}
