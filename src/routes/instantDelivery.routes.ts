import { Router } from 'express';
import { InstantDeliveryCartController } from '../controllers/instantDelivery.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: InstantDeliveryCart
 *   description: Instant parcel delivery cart management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     InstantDeliveryCart:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Cart unique identifier
 *         customerId:
 *           type: string
 *           format: uuid
 *           description: Customer user ID
 *         pickupLat:
 *           type: number
 *           format: double
 *           description: Pickup location latitude
 *           example: 28.7041
 *         pickupLng:
 *           type: number
 *           format: double
 *           description: Pickup location longitude
 *           example: 77.1025
 *         dropoffLat:
 *           type: number
 *           format: double
 *           description: Dropoff location latitude
 *           example: 28.5355
 *         dropoffLng:
 *           type: number
 *           format: double
 *           description: Dropoff location longitude
 *           example: 77.3910
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Number of parcels
 *           example: 1
 *         size:
 *           type: string
 *           enum: [SMALL, MEDIUM, LARGE]
 *           description: Parcel size
 *           example: MEDIUM
 *         picture:
 *           type: string
 *           nullable: true
 *           description: Parcel picture URL
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Cart creation timestamp
 *         customer:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *     CreateInstantDeliveryCart:
 *       type: object
 *       required:
 *         - customerId
 *         - pickupLat
 *         - pickupLng
 *         - dropoffLat
 *         - dropoffLng
 *         - quantity
 *         - size
 *       properties:
 *         customerId:
 *           type: string
 *           format: uuid
 *           description: Customer user ID
 *         pickupLat:
 *           type: number
 *           format: double
 *           description: Pickup location latitude
 *           example: 28.7041
 *         pickupLng:
 *           type: number
 *           format: double
 *           description: Pickup location longitude
 *           example: 77.1025
 *         dropoffLat:
 *           type: number
 *           format: double
 *           description: Dropoff location latitude
 *           example: 28.5355
 *         dropoffLng:
 *           type: number
 *           format: double
 *           description: Dropoff location longitude
 *           example: 77.3910
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Number of parcels
 *           example: 1
 *         size:
 *           type: string
 *           enum: [SMALL, MEDIUM, LARGE]
 *           description: Parcel size
 *           example: MEDIUM
 *         picture:
 *           type: string
 *           nullable: true
 *           description: Parcel picture URL (optional)
 *     UpdateInstantDeliveryCart:
 *       type: object
 *       properties:
 *         pickupLat:
 *           type: number
 *           format: double
 *         pickupLng:
 *           type: number
 *           format: double
 *         dropoffLat:
 *           type: number
 *           format: double
 *         dropoffLng:
 *           type: number
 *           format: double
 *         quantity:
 *           type: integer
 *           minimum: 1
 *         size:
 *           type: string
 *           enum: [SMALL, MEDIUM, LARGE]
 *         picture:
 *           type: string
 *           nullable: true
 */

/**
 * @swagger
 * /instantDelivery:
 *   post:
 *     summary: Create a new instant delivery cart
 *     description: Creates a new cart for instant parcel delivery with pickup and dropoff locations
 *     tags: [InstantDeliveryCart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInstantDeliveryCart'
 *     responses:
 *       201:
 *         description: Cart created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/InstantDeliveryCart'
 *       400:
 *         description: Missing required fields or validation error
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
 *                   example: Missing required fields
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
 *                   example: Invalid or expired token
 */
router.post('/', authenticate, InstantDeliveryCartController.createCart);

/**
 * @swagger
 * /instantDelivery:
 *   get:
 *     summary: Get all instant delivery carts
 *     description: Retrieves all carts with customer details, ordered by creation date (newest first)
 *     tags: [InstantDeliveryCart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all carts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InstantDeliveryCart'
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
 *                   example: Invalid or expired token
 *       500:
 *         description: Server error
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
 */
router.get('/', authenticate, InstantDeliveryCartController.getAll);

/**
 * @swagger
 * /instantDelivery/{id}:
 *   get:
 *     summary: Get cart by ID
 *     description: Retrieves a specific cart by its ID with customer details
 *     tags: [InstantDeliveryCart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cart ID
 *     responses:
 *       200:
 *         description: Cart found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/InstantDeliveryCart'
 *       400:
 *         description: Invalid ID or request error
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
 *                   example: Invalid or expired token
 *       404:
 *         description: Cart not found
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
 *                   example: Not found
 */
router.get('/:id', authenticate, InstantDeliveryCartController.getById);

/**
 * @swagger
 * /instantDelivery/{id}:
 *   put:
 *     summary: Update cart
 *     description: Updates an existing cart's details (partial update supported)
 *     tags: [InstantDeliveryCart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cart ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateInstantDeliveryCart'
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/InstantDeliveryCart'
 *       400:
 *         description: Invalid ID, validation error, or cart not found
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
 *                   example: Invalid or expired token
 */
router.put('/:id', authenticate, InstantDeliveryCartController.update);

/**
 * @swagger
 * /instantDelivery/{id}:
 *   delete:
 *     summary: Delete cart
 *     description: Permanently deletes a cart by its ID
 *     tags: [InstantDeliveryCart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Cart ID
 *     responses:
 *       204:
 *         description: Cart deleted successfully (no content)
 *       400:
 *         description: Invalid ID or cart not found
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
 *                   example: Invalid or expired token
 */
router.delete('/:id', authenticate, InstantDeliveryCartController.delete);

export default router;
