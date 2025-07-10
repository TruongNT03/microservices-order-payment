import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { mailContent } from './mailForm';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  sendMail = async () => {
    const info = await this.transporter.sendMail({
      from: `"Cửa hàng trực tuyến" <${process.env.MAIL_USER}>`,
      to: 'ntt26072003@gmail.com',
      subject: 'Đơn hàng được xác nhận',
      text: 'Hello world?', // plain‑text body
      html: mailContent, // HTML body
    });
  };
}
