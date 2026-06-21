import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';

@Injectable()
export class CryptoService {
  async hashPassword(password: string, rounds?: number) {
    return await bcrypt.hash(password, rounds ?? 10);
  }

  async comparePasswords(plain: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plain, hashed);
  }

  genNumericOTP(length = 6): string {
    if (length < 4 || length > 10) {
      throw new Error('OTP length must be between 4 and 10 digits for safety.');
    }

    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    const secureNumber = crypto.randomInt(min, max + 1);

    return secureNumber.toString();
  }
}
