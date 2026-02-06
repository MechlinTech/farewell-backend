import type { Request, Response } from 'express';
import { ForgotPasswordService } from '../services/forgotPassword.service.js';

export class ForgotPasswordController {
  /**
   * Initiate forgot password - send OTP
   */
  static async initiateForgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, newPassword, confirmPassword } = req.body;

      // Validate required fields
      if (!email || !newPassword || !confirmPassword) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: email, newPassword, confirmPassword',
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

      const result = await ForgotPasswordService.initiateForgotPassword(
        email,
        newPassword,
        confirmPassword
      );

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to process request',
      });
    }
  }

  /**
   * Verify OTP and reset password
   */
  static async verifyOTPAndResetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { userId, code, newPassword } = req.body;

      // Validate required fields
      if (!userId || !code || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: userId, code, newPassword',
        });
        return;
      }

      // Validate password strength
      if (newPassword.length < 8) {
        res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long',
        });
        return;
      }

      const result = await ForgotPasswordService.verifyAndResetPassword(
        userId,
        code,
        newPassword
      );

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Reset password error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to reset password',
      });
    }
  }
}
