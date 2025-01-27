import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { UserModule } from '../users/user.module';
import { EmailModule } from 'src/email/email.module';

dotenv.config();

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    UserModule,
    EmailModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3m' },
    }),
  ],
})
export class AuthModule {}
