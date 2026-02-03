import crypto from 'crypto';

/**
 * Generate a 4-digit OTP using crypto for better randomness
 */
export const generateOTP = (): string => {
  const otp = crypto.randomInt(1000, 10000);
  return otp.toString();
};

/**
 * OTP Configuration Constants
 */
export const OTP_CONFIG = {
  EXPIRY_MINUTES: 10,
  MAX_ATTEMPTS: 3,
  MAX_RESEND_COUNT: 2,
  RESEND_COOLDOWN_SECONDS: 30,
  LOCKOUT_HOURS: 24,
} as const;