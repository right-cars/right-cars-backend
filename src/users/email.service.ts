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
    const confirmationUrl = `${process.env.FRONTEND_URL}?token=${token}`;

    await this.transporter.sendMail({
      from: `"Right cars Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Confirm your email',
      html: `<p>Please confirm your email by clicking the link below:</p>
             <a href="${confirmationUrl}">${confirmationUrl}</a>`,
    });
  }
}
