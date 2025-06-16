import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.right-cars.co.za',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  async sendConfirmationEmail(to: string, token: string) {
    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm?token=${token}`;

    await this.transporter.sendMail({
      from: `"Right cars Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Confirm your email',
      html: `<p>Please confirm your email by clicking the link below:</p>
             <a href="${confirmationUrl}">${confirmationUrl}</a>`,
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset?token=${token}`;
    
    return this.transporter.sendMail({
      from: `"Right cars Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 24 hours.</p>`,
    });
  }
}
