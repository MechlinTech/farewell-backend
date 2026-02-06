import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken, verifyRefreshToken, type AppJwtPayload } from '../utils/jwt.js';
import prisma from '../config/prisma.js';
const SALT_ROUNDS = 12;

export class AuthService {
  /**
   * Create new user account
   */
  static async signup(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role?: 'CUSTOMER' | 'DRIVER' | 'ADMIN';
  }): Promise<{ userId: string; email: string; firstName: string }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      // If user exists but not verified, delete the old record to allow re-signup
      if (!existingUser.isVerified) {
        // Delete associated OTPs first (cascade may not be configured)
        await prisma.otp.deleteMany({
          where: { userId: existingUser.id },
        });
        
        // Delete the unverified user
        await prisma.user.delete({
          where: { id: existingUser.id },
        });
      } else {
        // User is verified, cannot re-signup
        throw new Error('Email already registered');
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: data.role || 'CUSTOMER',
      },
    });

    return {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
    };
  }

  /**
   * Login user
   */
  static async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw new Error('Email not verified. Please verify your email first.');
    }

    // Check if account is locked
    if (user.accountStatus === 'LOCKED') {
      throw new Error('Account is locked. Please contact support.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const payload: AppJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        accountStatus: user.accountStatus,
        createdAt: user.createdAt,
      },
    };
  }

  /**
   * Refresh access token
   */
  static async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Check if user still exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.isVerified) {
        throw new Error('User not verified');
      }

      if (user.accountStatus === 'LOCKED') {
        throw new Error('Account is locked');
      }

      // Generate new access token
      const payload: AppJwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = signAccessToken(payload);

      return { accessToken };
    } catch (error: any) {
      throw new Error(`Invalid refresh token: ${error.message}`);
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        accountStatus: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
