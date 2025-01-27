import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';

type AuthInput = { email: string; password: string };
type SinginData = { name: string; administrator: boolean };
type AuthResult = { accesToken: string; name: string; administrator: boolean };

@Injectable()
export class AuthService {
  constructor(
    private userSevice: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.signIn(user);
  }
  async validateUser(input: AuthInput): Promise<SinginData | null> {
    const user = await this.userSevice.findUserByEmail(input.email);

    if (user && user.password === input.password) {
      return {
        name: user.name,
        administrator: user.administrator,
      };
    }
    return null;
  }
  async signIn(user: SinginData): Promise<AuthResult> {
    const payload = { name: user.name };
    const accesToken = await this.jwtService.signAsync(payload);
    return { accesToken, name: user.name, administrator: user.administrator };
  }

  async initiatePasswordReset(email: string): Promise<void> {
    // Buscar usuario
    const user = await this.userSevice.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-character token
    await this.userSevice.setRecoveryCode(user.id, resetToken); // Guardar token para el usuario
    await this.emailService.sendPasswordResetToken(email, resetToken); // Enviar token por email
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userSevice.findByResetToken(token);
    if (!user) {
      throw new BadRequestException('Invalid reset token');
    }

    await this.userSevice.updatePassword(user.id, newPassword);
  }
}
