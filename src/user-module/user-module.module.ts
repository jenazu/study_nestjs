import { Module } from '@nestjs/common';
import { UserService } from './user-service/user-service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.model';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './user-service/auth.service';
import { AuthController } from './controller/auth.controller';
import { UserRepository } from './repositories/user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './controller/user.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRETKEY'),
        signOptions: {
          expiresIn: configService.get('EXPIRESIN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserService, AuthService, UserRepository, JwtStrategy],
  controllers: [AuthController, UserController],
  exports: [UserService],
})
export class UserModuleModule {}
