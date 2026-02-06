import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { ForgotPasswordController } from '../controllers/forgotPassword.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: User signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [CUSTOMER, DRIVER, ADMIN]
 *     responses:
 *       201:
 *         description: User created, OTP sent
 */
router.post('/signup', AuthController.signup);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - code
 *             properties:
 *               userId:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 */
router.post('/verify-otp', AuthController.verifyOTP);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP resent
 */
router.post('/resend-otp', AuthController.resendOTP);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT tokens
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token
 */
router.post('/refresh', AuthController.refreshToken);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 */
router.get('/me', authenticate, AuthController.me);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Initiate forgot password
 *     description: Send email, new password and confirm password to receive OTP for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Registered email address
 *                 example: user@example.com
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 description: New password (minimum 8 characters)
 *                 example: NewPassword123!
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm new password (must match newPassword)
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP sent to your email
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                   description: User ID needed for OTP verification
 *                 canResendAt:
 *                   type: string
 *                   format: date-time
 *                   description: Time when OTP can be resent
 *       400:
 *         description: Invalid request or account locked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Passwords do not match
 */
router.post('/forgot-password', ForgotPasswordController.initiateForgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Verify OTP and reset password
 *     description: Verify OTP code and reset password. Max 3 attempts, then account locked for 24 hours. Max 2 resends allowed.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - code
 *               - newPassword
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: User ID from forgot-password response
 *                 example: 550e8400-e29b-41d4-a716-446655440000
 *               code:
 *                 type: string
 *                 description: 4-digit OTP code from email
 *                 example: "1234"
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 description: New password (minimum 8 characters)
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Invalid OTP or account locked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid OTP. 2 attempts remaining.
 *                 locked:
 *                   type: boolean
 *                   description: Whether account is locked
 *                 lockedUntil:
 *                   type: string
 *                   format: date-time
 *                   description: Time when account will be unlocked
 */
router.post('/reset-password', ForgotPasswordController.verifyOTPAndResetPassword);

export default router;
