import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.mailersend.net',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: 'MS_dLmSqC@trial-3zxk54vewdqljy6v.mlsender.net',
        pass: 'mssp.cLrzqya.ynrw7gye2nj42k8e.kVNI29v',
      },
    });
  }

  async sendPasswordResetToken(to: string, token: string): Promise<void> {
    await this.transporter.sendMail({
      from: '"CasaCem" <orgcasacem@gmail.com>',
      to: to,
      subject: 'Token de recuperación de contraseña',
      text: `Your password reset token is: ${token}`,
      html: `<p>Your password reset token is: <strong>${token}</strong></p>`,
    });
  }
}
