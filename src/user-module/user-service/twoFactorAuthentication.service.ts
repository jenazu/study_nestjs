import { ConfigService } from '@nestjs/config';
import { UserService } from './user-service';
import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      user.email,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );
    await this.userService.setTwoFactorAuthenticationSecret(secret, user._id);
    return {
      secret,
      otpAuthUrl,
    };
  }

  async pipeQrCodeStream(stream: any, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }

  async isTwoFactorAuthenticationCodeValid(code, user) {
    return authenticator.verify({
      token: code,
      secret: user.twoFactorAuthenticationSecret,
    });
  }
}
