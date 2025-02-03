import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export const nodemailerOptions: SMTPTransport.Options = {
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};
