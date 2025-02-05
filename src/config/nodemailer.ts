import type SMTPTransport from 'nodemailer/lib/smtp-transport';

export const nodemailerOptions: SMTPTransport.Options = {
  host: process.env.SMTP_EMAIL_HOST,
  port: Number(process.env.SMTP_EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL_USER,
    pass: process.env.SMTP_EMAIL_PASS,
  },
};
