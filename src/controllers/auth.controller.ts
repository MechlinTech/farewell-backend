import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { OTPService } from '../services/otp.service.js';

export class AuthController {
  /**
   * Signup - Create new user and send OTP
   */
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { firstName, lastName, email, phone, password, role } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !phone || !password) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields',
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: 'Invalid email format',
        });
        return;
      }

      // Validate password strength (min 8 chars)
      if (password.length < 8) {
        res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long',
        });
        return;
      }
      else if (password.length > 16) {
        res.status(400).json({
          success: false,
          message: 'Password must be less than 16 characters long',
        });
        return;
      }

      // Create user
      const user = await AuthService.signup({
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
      });

      // Send OTP
      const otpResult = await OTPService.createAndSendOTP(
        user.userId,
        user.email,
        user.firstName
      );

      if (!otpResult.success) {
        res.status(500).json({
          success: false,
          message: 'User created but failed to send OTP',
          userId: user.userId,
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: 'Signup successful. Please verify your email with the OTP sent.',
        userId: user.userId,
        email: user.email,
        canResendAt: otpResult.canResendAt,
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Signup failed',
      });
    }
  }

  /**
   * Verify OTP
   */
  static async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { userId, code } = req.body;

      if (!userId || !code) {
        res.status(400).json({
          success: false,
          message: 'Missing userId or code',
        });
        return;
      }

      const result = await OTPService.verifyOTP(userId, code);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Email verified successfully. You can now login.',
      });
    } catch (error: any) {
      console.error('OTP verification error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'OTP verification failed',
      });
    }
  }

  /**
   * Resend OTP
   */
  static async resendOTP(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;

      if (!userId) {
        res.status(400).json({
          success: false,
          message: 'Missing userId',
        });
        return;
      }

      // Get user details
      const user = await AuthService.getUserById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      // Send OTP
      const result = await OTPService.createAndSendOTP(
        user.id,
        user.email,
        user.firstName
      );

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to resend OTP',
      });
    }
  }

  /**
   * Login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Missing email or password',
        });
        return;
      }

      const result = await AuthService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        ...result,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed',
      });
    }
  }

  /**
   * Refresh token
   */
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Missing refresh token',
        });
        return;
      }

      const result = await AuthService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        ...result,
      });
    } catch (error: any) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Token refresh failed',
      });
    }
  }

  /**
   * Get current user
   */
  static async me(req: Request, res: Response): Promise<void> {
    try {
      // @ts-ignore - userId is added by auth middleware
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const user = await AuthService.getUserById(userId);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get user',
      });
    }
  }
}
