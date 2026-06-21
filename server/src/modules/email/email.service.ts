import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async notifyOTP(
    to: string,
    subject: string,
    html: string,
    from?: string,
  ): Promise<void> {
    const info = (await this.mailerService.sendMail({
      from: from ?? 'Chat Hive',
      to,
      subject,
      html,
    })) as { messageId: string };

    console.log(`Email sent successfully to ${to}: ${info.messageId}`);
  }

  async sendWelcomeEmail(to: string, username: string): Promise<void> {
    const subject = 'Welcome to Chat Hive!';
    const html = this.getWelcomeTemplate(username);

    await this.notifyOTP(to, subject, html);
  }

  async sendOTPEmail(
    to: string,
    username: string,
    otpCode: string,
    expireTimeInMinutes: number = 5,
  ): Promise<void> {
    const subject = `${otpCode} is your Chat Hive Verification Code`;
    const html = this.getOTPTemplate(username, otpCode, expireTimeInMinutes);

    await this.notifyOTP(to, subject, html);
  }

  private getWelcomeTemplate(username: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Chat Hive</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #1f2937; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: #facc15; padding: 32px; text-align: center; }
          .header h1 { margin: 0; color: #1e293b; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
          .content { padding: 40px; line-height: 1.6; }
          .welcome-text { font-size: 18px; color: #111827; margin-bottom: 24px; }
          .features-box { background-color: #fef08a; border-radius: 8px; padding: 24px; margin: 28px 0; border-left: 4px solid #ca8a04; }
          .features-title { font-weight: 700; color: #713f12; margin-top: 0; margin-bottom: 12px; font-size: 16px; }
          .feature-list { margin: 0; padding-left: 20px; color: #451a03; font-size: 14px; }
          .feature-list li { margin-bottom: 8px; }
          .footer { background: #f9fafb; text-align: center; padding: 24px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Chat Hive</h1>
          </div>
          <div class="content">
            <p class="welcome-text">Hey <strong>${username}</strong>,</p>
            <p>Welcome to Chat Hive! Your account has been successfully verified. You're all set to jump in and experience the ultimate real-time chat platform.</p>
            
            <div class="features-box">
              <p class="features-title">⚡ What you can do right now:</p>
              <ul class="feature-list">
                <li><strong>Live Conversations:</strong> Chat instantly via powered Socket.IO connections.</li>
                <li><strong>Read Receipts:</strong> Know exactly when your messages are delivered and seen live.</li>
                <li><strong>Media Sharing:</strong> Share up to 15 high-quality images directly in any chat thread.</li>
                <li><strong>Typing Indicators:</strong> See who is active and typing inside conversations in real time.</li>
              </ul>
            </div>
            
            <p>We are thrilled to have you as part of our hive!</p>
            <p>Best regards,<br><strong>The Chat Hive Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Chat Hive. Securely verified via Email & Token Rotation.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getOTPTemplate(
    username: string,
    otpCode: string,
    expireTimeInMinutes: number,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #1f2937; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: #facc15; padding: 32px; text-align: center; }
          .header h1 { margin: 0; color: #1e293b; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
          .content { padding: 40px; text-align: center; line-height: 1.6; }
          .salutation { font-size: 18px; color: #111827; margin-bottom: 16px; text-align: left; }
          .instruction { color: #4b5563; font-size: 15px; margin-bottom: 32px; text-align: left; }
          .otp-container { background-color: #f3f4f6; border-radius: 8px; padding: 24px; margin: 24px 0; border: 1px dashed #d1d5db; display: inline-block; letter-spacing: 6px; font-weight: 800; font-size: 36px; color: #111827; }
          .expiry-warning { color: #dc2626; font-size: 13px; font-weight: 500; margin-top: 16px; }
          .security-note { font-size: 13px; color: #6b7280; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 24px; text-align: left; }
          .footer { background: #f9fafb; text-align: center; padding: 24px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Chat Hive</h1>
          </div>
          <div class="content">
            <p class="salutation">Hello <strong>${username}</strong>,</p>
            <p class="instruction">Someone requested a One-Time Password (OTP) for your Chat Hive account. Use the verification code below to complete the authentication process:</p>
            
            <div class="otp-container">
              ${otpCode}
            </div>
            
            <p class="expiry-warning">This code is strictly confidential and will expire in ${expireTimeInMinutes} minutes.</p>
            
            <div class="security-note">
              <p><strong>Didn't request this?</strong> If you didn't initiate this action, please ignore this email or change your password immediately if you feel your account security is compromised.</p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Chat Hive. Securely verified via Email & Token Rotation.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
