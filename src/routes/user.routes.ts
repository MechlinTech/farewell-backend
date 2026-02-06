import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { userController } from '../controllers/user.controller.js';

const router = Router();

/**
 * @swagger
 * /users/my-location:
 *   get:
 *     summary: Get my location
 *     description: Retrieves the most recent location data for the authenticated user from JWT token and reverse geocodes it to get formatted address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My location retrieved successfully
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
 *                   example: "My location retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     userId:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440001"
 *                     locationLat:
 *                       type: number
 *                       example: 37.7749
 *                     locationLng:
 *                       type: number
 *                       example: -122.4194
 *                     formattedAddress:
 *                       type: string
 *                       nullable: true
 *                       example: "San Francisco, CA, USA"
 *                     placeId:
 *                       type: string
 *                       nullable: true
 *                       example: "ChIJIQBpAG2ahYAR_6128GcTUEo"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
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
 *       404:
 *         description: No location found for this user
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
 *                   example: "No location found for this user, please set"
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
 *                   example: "Failed to retrieve location"
 */
router.get('/my-location', authenticate, userController.getMyLocation);

/**
 * @swagger
 * /users/my-location:
 *   post:
 *     summary: Create my location
 *     description: Creates a new location entry for the authenticated user from JWT token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - locationLat
 *               - locationLng
 *             properties:
 *               locationLat:
 *                 type: number
 *                 example: 37.7749
 *                 description: Latitude of the location
 *               locationLng:
 *                 type: number
 *                 example: -122.4194
 *                 description: Longitude of the location
 *     responses:
 *       201:
 *         description: My location created successfully
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
 *                   example: "My location created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     userId:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440001"
 *                     locationLat:
 *                       type: number
 *                       example: 37.7749
 *                     locationLng:
 *                       type: number
 *                       example: -122.4194
 *                     formattedAddress:
 *                       type: string
 *                       nullable: true
 *                       example: "San Francisco, CA, USA"
 *                     placeId:
 *                       type: string
 *                       nullable: true
 *                       example: "ChIJIQBpAG2ahYAR_6128GcTUEo"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00.000Z"
 *       400:
 *         description: Bad request - Missing required fields
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
 *                   example: "Location latitude and longitude are required"
 *       401:
 *         description: Unauthorized - Invalid or missing token
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
 *                   example: "Failed to create location"
 */
router.post('/my-location', authenticate, userController.createMyLocation);

/**
 * @swagger
 * /users/my-location:
 *   patch:
 *     summary: Update my location
 *     description: Updates the latest location entry for the authenticated user from JWT token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               locationLat:
 *                 type: number
 *                 example: 37.7749
 *                 description: Latitude of the location
 *               locationLng:
 *                 type: number
 *                 example: -122.4194
 *                 description: Longitude of the location
 *     responses:
 *       200:
 *         description: My location updated successfully
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
 *                   example: "My location updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     userId:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440001"
 *                     locationLat:
 *                       type: number
 *                       example: 37.7749
 *                     locationLng:
 *                       type: number
 *                       example: -122.4194
 *                     formattedAddress:
 *                       type: string
 *                       nullable: true
 *                       example: "San Francisco, CA, USA"
 *                     placeId:
 *                       type: string
 *                       nullable: true
 *                       example: "ChIJIQBpAG2ahYAR_6128GcTUEo"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:30:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
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
 *       404:
 *         description: Location not found for this user
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
 *                   example: "Location not found for this user"
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
 *                   example: "Failed to update location"
 */
router.patch('/my-location', authenticate, userController.updateMyLocation);

/**
 * @swagger
 * /users/my-location:
 *   delete:
 *     summary: Delete my location
 *     description: Deletes the latest location entry for the authenticated user from JWT token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My location deleted successfully
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
 *                   example: "Location deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
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
 *       404:
 *         description: Location not found for this user
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
 *                   example: "Location not found for this user"
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
 *                   example: "Failed to delete location"
 */
router.delete('/my-location', authenticate, userController.deleteMyLocation);

export default router;
