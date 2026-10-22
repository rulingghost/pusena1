import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly config: ConfigService) {
    this.initTransporter();
  }

  private initTransporter() {
    const host = this.config.get<string>('SMTP_HOST');
    const port = Number(this.config.get<string>('SMTP_PORT')) || 587;
    const user = this.config.get<string>('SMTP_USER') || this.config.get<string>('GMAIL_USER');
    const pass = this.config.get<string>('SMTP_PASS') || this.config.get<string>('GMAIL_APP_PASSWORD') || this.config.get<string>('GMAIL_PASS');

    if (user && pass) {
      if (host) {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });
      } else {
        // Default to standard Gmail service
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user, pass },
        });
      }
      this.logger.log(`E-posta servisi ${user} ile hazırlandı.`);
    } else {
      this.logger.warn('SMTP veya Gmail kimlik bilgileri (.env) bulunamadı. E-posta kodları sunucu konsoluna yazılacaktır.');
    }
  }

  async sendPasswordResetCode(toEmail: string, code: string): Promise<boolean> {
    const fromAddress = this.config.get<string>('SMTP_FROM') || this.config.get<string>('SMTP_USER') || 'Pusena <destek@pusena.com>';

    const subject = `${code} — Pusena Şifre Sıfırlama Kodunuz`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; border: 1px solid #F3E8EE; border-radius: 20px; background-color: #FFFFFF;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #C96BAE; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 0.5px;">Pusena</h1>
          <p style="color: #8E8E93; font-size: 13px; margin: 6px 0 0 0; letter-spacing: 0.3px;">Kadın Yaşam & Sağlık Asistanı</p>
        </div>

        <div style="background-color: #FFF5F9; border-radius: 16px; padding: 20px; margin-bottom: 24px; border: 1px solid #FFE4EE;">
          <h2 style="color: #1C1C1E; font-size: 17px; font-weight: 700; margin: 0 0 8px 0;">Şifre Sıfırlama Talebi</h2>
          <p style="color: #3C3C43; font-size: 14px; line-height: 21px; margin: 0;">
            Merhaba, Pusena hesabınızın şifresini sıfırlamak için bir kod talep ettiniz. Yeni şifrenizi belirlemek için aşağıdaki 6 haneli doğrulama kodunu uygulamaya giriniz:
          </p>
        </div>

        <div style="text-align: center; margin: 28px 0;">
          <div style="display: inline-block; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #C96BAE; background: #FFFFFF; padding: 16px 32px; border-radius: 16px; border: 2px dashed #C96BAE; box-shadow: 0 4px 12px rgba(201, 107, 174, 0.12);">
            ${code}
          </div>
        </div>

        <p style="color: #666668; font-size: 13px; line-height: 20px; text-align: center; margin: 0 0 20px 0;">
          ⏱️ Bu kod <strong>15 dakika</strong> boyunca geçerlidir.<br/>
          Güvenliğiniz için bu kodu kimseyle paylaşmayınız.
        </p>

        <div style="border-top: 1px solid #F2F2F7; padding-top: 18px; margin-top: 24px; text-align: center;">
          <p style="color: #8E8E93; font-size: 11.5px; line-height: 17px; margin: 0;">
            Bu talebi siz yapmadıysanız bu e-postayı güvenle göz ardı edebilirsiniz; mevcut şifreniz değişmeyecektir.
          </p>
          <p style="color: #AEAEB2; font-size: 11px; margin: 12px 0 0 0;">
            © 2026 Pusena. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    `;

    // Try sending via nodemailer transporter
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: fromAddress,
          to: toEmail,
          subject,
          text: `Pusena Şifre Sıfırlama Kodunuz: ${code}. Bu kod 15 dakika geçerlidir.`,
          html,
        });
        this.logger.log(`Şifre sıfırlama e-postası başarıyla gönderildi: ${toEmail}`);
        return true;
      } catch (err: any) {
        this.logger.error(`E-posta gönderimi başarısız oldu (${toEmail}): ${err?.message || err}`);
      }
    }

    // Try Resend API if configured
    const resendKey = this.config.get<string>('RESEND_API_KEY');
    if (resendKey) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress.includes('@') ? fromAddress : 'Pusena <onboarding@resend.dev>',
            to: [toEmail],
            subject,
            html,
          }),
        });
        if (res.ok) {
          this.logger.log(`Şifre sıfırlama e-postası Resend üzerinden iletildi: ${toEmail}`);
          return true;
        }
      } catch (e: any) {
        this.logger.error(`Resend API hatası: ${e?.message || e}`);
      }
    }

    // Fallback: Console log
    this.logger.warn(`[GMAIL DEV KODU] ${toEmail} için üretilen doğrulama kodu: ${code}`);
    return false;
  }
}
