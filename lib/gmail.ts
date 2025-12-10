import { createTransport } from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

export async function sendVerificationEmail(to: string, code: string) {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  const mailOpts: MailOptions = {
    from: `"KARROT-MARKET" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Email Verification",
    text: `Verification Code: ${code}`,
    html: `<p>Verification Code: <b>${code}</b></p>`,
  };

  await transporter.sendMail(mailOpts);
}
