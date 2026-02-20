import prisma from '../config/prisma.config.js';
import bcrypt from 'bcrypt';
import { generateOTP, OTP_CONFIG } from '../utils/otp.util.js';
import { sendOTPEmail, sendAccountLockedEmail } from '../lib/mail.lib.js';

const SALT_ROUNDS = 12;

export class ForgotPasswordService {
  /**
   * Initiate forgot password - validate and send OTP
   */
  static async initiateForgotPassword(
    email: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message: string; userId?: string; canResendAt?: Date }> {
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Validate password strength
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { otps: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!user) {
      throw new Error('No account found with this email');
    }

    // Check if account is locked
    if (user.accountStatus === 'LOCKED') {
      throw new Error('Account is locked. Please contact support.');
    }

    const latestOtp = user.otps[0];
    const cooldownMs = OTP_CONFIG.RESEND_COOLDOWN_SECONDS * 1000;

    // Check if account is locked due to OTP attempts
    if (latestOtp?.lockedUntil && latestOtp.lockedUntil > new Date()) {
      return {
        success: false,
        message: `Account is locked due to too many attempts. Try again after ${latestOtp.lockedUntil.toLocaleString()}`,
        canResendAt: latestOtp.lockedUntil,
      };
    }

    // Check if user has exceeded resend limit
    if (latestOtp && !this.isOTPExpired(latestOtp.expiresAt)) {
      if (latestOtp.resendCount >= OTP_CONFIG.MAX_RESEND_COUNT) {
        // Lock account for 24 hours
        const lockUntil = new Date(Date.now() + OTP_CONFIG.LOCKOUT_HOURS * 60 * 60 * 1000);

        await prisma.otp.update({
          where: { id: latestOtp.id },
          data: { lockedUntil: lockUntil },
        });

        // Send locked notification
        await sendAccountLockedEmail(email, user.firstName, lockUntil);

        return {
          success: false,
          message: `Too many resend attempts. Account locked until ${lockUntil.toLocaleString()}`,
          canResendAt: lockUntil,
        };
      }

      // Check cooldown period (30 seconds)
      const timeSinceLastSend = Date.now() - latestOtp.createdAt.getTime();

      if (timeSinceLastSend < cooldownMs) {
        const canResendAt = new Date(latestOtp.createdAt.getTime() + cooldownMs);
        return {
          success: false,
          message: `Please wait ${OTP_CONFIG.RESEND_COOLDOWN_SECONDS} seconds before requesting a new OTP`,
          canResendAt,
        };
      }
    }

    // Generate new OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000);

    // Create new OTP record
    const resendCount = latestOtp && !this.isOTPExpired(latestOtp.expiresAt) 
      ? latestOtp.resendCount + 1 
      : 0;

    await prisma.otp.create({
      data: {
        userId: user.id,
        code: otpCode,
        expiresAt,
        resendCount,
      },
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otpCode, user.firstName);
      return {
        success: true,
        message: 'OTP sent to your email',
        userId: user.id,
        canResendAt: new Date(Date.now() + cooldownMs),
      };
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  /**
   * Verify OTP and reset password
   */
  static async verifyAndResetPassword(
    userId: string,
    code: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string; locked?: boolean; lockedUntil?: Date }> {
    // Get latest OTP for user
    const latestOtp = await prisma.otp.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });

    if (!latestOtp) {
      return { success: false, message: 'No OTP found. Please request a new one.' };
    }

    // Check if locked
    if (latestOtp.lockedUntil && latestOtp.lockedUntil > new Date()) {
      return {
        success: false,
        message: `Account is locked. Try again after ${latestOtp.lockedUntil.toLocaleString()}`,
        locked: true,
        lockedUntil: latestOtp.lockedUntil,
      };
    }

    // Check if expired
    if (this.isOTPExpired(latestOtp.expiresAt)) {
      return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    // Check if code matches
    if (latestOtp.code !== code) {
      const newAttempts = latestOtp.attempts + 1;

      // Check if max attempts reached
      if (newAttempts >= OTP_CONFIG.MAX_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + OTP_CONFIG.LOCKOUT_HOURS * 60 * 60 * 1000);

        await prisma.otp.update({
          where: { id: latestOtp.id },
          data: {
            attempts: newAttempts,
            lockedUntil: lockUntil,
          },
        });

        // Send locked notification
        await sendAccountLockedEmail(
          latestOtp.user.email,
          latestOtp.user.firstName,
          lockUntil
        );

        return {
          success: false,
          message: `Too many failed attempts. Account locked for 24 hours.`,
          locked: true,
          lockedUntil: lockUntil,
        };
      }

      // Increment attempts
      await prisma.otp.update({
        where: { id: latestOtp.id },
        data: { attempts: newAttempts },
      });

      const remainingAttempts = OTP_CONFIG.MAX_ATTEMPTS - newAttempts;
      return {
        success: false,
        message: `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`,
      };
    }

    // OTP is valid - hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Delete all OTPs for this user
    await prisma.otp.deleteMany({
      where: { userId },
    });

    return { success: true, message: 'Password reset successfully' };
  }

  /**
   * Check if OTP is expired
   */
  private static isOTPExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }
}
