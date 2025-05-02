import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { HashServiceInterface } from '../interfaces/services/hash.service.interface';

@Injectable()
export class HashService implements HashServiceInterface {
  async hashClaims(parameter: any): Promise<string> {
    return await bcrypt.hash(parameter, 10);
  }

  async compareClaims(plainClaims: string, hashedClaims: string): Promise<boolean> {
    return bcrypt.compare(plainClaims, hashedClaims);
  }
}