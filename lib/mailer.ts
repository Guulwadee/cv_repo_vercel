import nodemailer from 'nodemailer';
import { renderEmail } from './emails';

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.EMAIL_SERVER || !process.env.EMAIL_FROM) {
    console.log('EMAIL (simulated):', { to, subject });
    return { accepted: [to] };
  }
  const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html
  });
  return info;
}

export function wrapEmail(htmlInner: string) {
  return renderEmail(<div dangerouslySetInnerHTML={{ __html: htmlInner }} />);
}
