import { Router } from 'express';
import { RiderController } from '../controllers/rider.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /rider/start-rider-kyc:
 *   post:
 *     summary: Start rider KYC
 *     tags: [Rider]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rider KYC started successfully
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
 *                   example: "Rider KYC started successfully"
 *                 url:
 *                   type: string
 *                   example: "https://dashboard.stripe.com/account/onboarding?account=acct_1234567890&return_url=https://example.com/rider/kyc"
 *       401:
 *         description: Unauthorized
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
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
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
 *                   example: "Failed to start rider KYC"
 *       400:
 *         description: Bad request
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
 *                   example: "Failed to generate onboarding link"
 */
router.post('/start-rider-kyc', authenticate, RiderController.startRiderKyc);

/**
 * @swagger
 * /rider/verification-status:
 *   get:
 *     summary: Get rider verification status by user ID
 *     description: Retrieves the verification status (VERIFIED, UNVERIFIED, or REJECTED) for a rider based on their user ID
 *     tags: [Rider]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID of the rider
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Verification status fetched successfully
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
 *                   example: "Verification status fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     isVerified:
 *                       type: string
 *                       enum: [VERIFIED, UNVERIFIED, REJECTED]
 *                       example: "VERIFIED"
 *       400:
 *         description: Bad request - Missing user ID
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
 *                   example: "User ID is required"
 *       404:
 *         description: Rider not found
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
 *                   example: "Rider not found"
 */
router.get('/verification-status', RiderController.getVerificationStatus);

export default router;