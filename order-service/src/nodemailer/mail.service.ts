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
  sendMail = async (
    toMail: string,
    subject: string,
    order_id: number,
    name: string,
  ) => {
    const info = await this.transporter.sendMail({
      from: `"Cửa hàng trực tuyến" <${process.env.MAIL_USER}>`,
      to: toMail,
      subject: subject,
      html: mailContent(order_id, name),
    });
    console.log(`Đã gửi mail xác nhận đến: ${toMail}`);
  };
}
