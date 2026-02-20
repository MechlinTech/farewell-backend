import sgMail from '@sendgrid/mail';
import { env } from '../config/env.config.js';

const SENDGRID_API_KEY = env.sendgrid_api_key;
const EMAIL_FROM = env.email_from;

if (!SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined in environment variables');
}

if (!EMAIL_FROM) {
  throw new Error('EMAIL_FROM is not defined in environment variables');
}

sgMail.setApiKey(SENDGRID_API_KEY);

/**
 * Send OTP verification email
 */
export const sendOTPEmail = async (
  email: string,
  otp: string,
  firstName: string
): Promise<void> => {
  const msg = {
    to: email,
    from: EMAIL_FROM,
    subject: 'Verify Your Email - Farewell',
    text: `Hello ${firstName},\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.\n\nBest regards,\nFarewell Team`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .otp-code { font-size: 32px; font-weight: bold; color: #4F46E5; text-align: center; letter-spacing: 8px; padding: 20px; background: white; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .warning { color: #dc2626; font-size: 14px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${firstName}</strong>,</p>
              <p>Thank you for signing up with Farewell. To complete your registration, please use the verification code below:</p>
              <div class="otp-code">${otp}</div>
              <p>This code will expire in <strong>10 minutes</strong>.</p>
              <p class="warning">⚠️ Important: After 3 incorrect attempts, your account will be locked for 24 hours for security purposes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
              <p>Best regards,<br><strong>Farewell Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Farewell. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error: any) {
    console.error('Error sending OTP email:', error);
    if (error.response) {
      console.error('SendGrid error:', error.response.body);
    }
    throw new Error('Failed to send OTP email');
  }
};

/**
 * Send account locked notification email
 */
export const sendAccountLockedEmail = async (
  email: string,
  firstName: string,
  unlockTime: Date
): Promise<void> => {
  const msg = {
    to: email,
    from: EMAIL_FROM,
    subject: 'Account Temporarily Locked - Farewell',
    text: `Hello ${firstName},\n\nYour account has been temporarily locked due to multiple failed OTP verification attempts.\n\nYour account will be automatically unlocked at: ${unlockTime.toLocaleString()}\n\nIf you didn't attempt to verify your account, please contact our support team immediately.\n\nBest regards,\nFarewell Team`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .unlock-time { font-size: 18px; font-weight: bold; color: #dc2626; text-align: center; padding: 15px; background: white; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Account Locked</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${firstName}</strong>,</p>
              <p>Your account has been temporarily locked due to multiple failed OTP verification attempts.</p>
              <div class="unlock-time">
                Unlock Time: ${unlockTime.toLocaleString()}
              </div>
              <p>This is a security measure to protect your account. Your account will be automatically unlocked after 24 hours.</p>
              <p>If you didn't attempt to verify your account, please contact our support team immediately.</p>
              <p>Best regards,<br><strong>Farewell Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Farewell. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error: any) {
    console.error('Error sending account locked email:', error);
    if (error.response) {
      console.error('SendGrid error:', error.response.body);
    }
  }
};

