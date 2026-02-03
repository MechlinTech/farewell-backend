import { generateOTP, OTP_CONFIG } from '../utils/otp.js';
import { sendOTPEmail, sendAccountLockedEmail } from '../lib/mail.js';
import prisma from '../config/prisma.js';

export class OTPService {
  /**
   * Create and send OTP for email verification
   */
  static async createAndSendOTP(
    userId: string,
    email: string,
    firstName: string
  ): Promise<{ success: boolean; message: string; canResendAt?: Date }> {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { otps: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isVerified) {
      return { success: false, message: 'Email already verified' };
    }

    const latestOtp = user.otps[0];
    const cooldownMs = OTP_CONFIG.RESEND_COOLDOWN_SECONDS * 1000;

    // Check if account is locked
    if (latestOtp?.lockedUntil && latestOtp.lockedUntil > new Date()) {
      return {
        success: false,
        message: `Account is locked due to too many failed attempts. Try again after ${latestOtp.lockedUntil.toLocaleString()}`,
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
        await sendAccountLockedEmail(email, firstName, lockUntil);

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
        userId,
        code: otpCode,
        expiresAt,
        resendCount,
      },
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otpCode, firstName);
      return { 
        success: true, 
        message: 'OTP sent successfully',
        canResendAt: new Date(Date.now() + cooldownMs),
      };
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  /**
   * Verify OTP code
   */
  static async verifyOTP(
    userId: string,
    code: string
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

    // OTP is valid - mark user as verified
    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    // Delete all OTPs for this user
    await prisma.otp.deleteMany({
      where: { userId },
    });

    return { success: true, message: 'Email verified successfully' };
  }

  /**
   * Check if OTP is expired
   */
  private static isOTPExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }

  /**
   * Clean up expired OTPs (can be run as a cron job)
   */
  static async cleanupExpiredOTPs(): Promise<number> {
    const result = await prisma.otp.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
        lockedUntil: null,
      },
    });

    return result.count;
  }

  /**
   * Unlock expired locked accounts
   */
  static async unlockExpiredAccounts(): Promise<number> {
    const result = await prisma.otp.updateMany({
      where: {
        lockedUntil: { lte: new Date() },
      },
      data: {
        lockedUntil: null,
        attempts: 0,
      },
    });

    return result.count;
  }
}
