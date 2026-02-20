import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { CustomerController } from '../controllers/customer.controllers.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Customer
 *   description: Customer order management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerAddress:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         userId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         addressLine1:
 *           type: string
 *           example: "123 Main St"
 *         addressLine2:
 *           type: string
 *           nullable: true
 *           example: "Apt 4B"
 *         city:
 *           type: string
 *           example: "San Francisco"
 *         state:
 *           type: string
 *           example: "CA"
 *         country:
 *           type: string
 *           example: "United States"
 *         postalCode:
 *           type: string
 *           example: "94102"
 *         lat:
 *           type: number
 *           format: double
 *           example: 37.7749
 *         lng:
 *           type: number
 *           format: double
 *           example: -122.4194
 *         addressType:
 *           type: string
 *           enum: [HOME, WORK, OTHER]
 *           example: "HOME"
 *         isDefault:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *     CreateAddressRequest:
 *       type: object
 *       required:
 *         - addressLine1
 *         - city
 *         - state
 *         - country
 *         - postalCode
 *         - lat
 *         - lng
 *         - addressType
 *       properties:
 *         addressLine1:
 *           type: string
 *           example: "123 Main St"
 *         addressLine2:
 *           type: string
 *           nullable: true
 *           example: "Apt 4B"
 *         city:
 *           type: string
 *           example: "San Francisco"
 *         state:
 *           type: string
 *           example: "CA"
 *         country:
 *           type: string
 *           example: "United States"
 *         postalCode:
 *           type: string
 *           example: "94102"
 *         lat:
 *           type: number
 *           format: double
 *           example: 37.7749
 *         lng:
 *           type: number
 *           format: double
 *           example: -122.4194
 *         addressType:
 *           type: string
 *           enum: [HOME, WORK, OTHER]
 *           example: "HOME"
 *         isDefault:
 *           type: boolean
 *           example: false
 *     ZipLocation:
 *       type: object
 *       properties:
 *         city:
 *           type: string
 *           example: "San Francisco"
 *         state:
 *           type: string
 *           example: "CA"
 *         country:
 *           type: string
 *           example: "United States"
 *     OrderDetails:
 *       type: object
 *       properties:
 *         orderId:
 *           type: string
 *           example: "ORD-123456"
 *         status:
 *           type: string
 *           enum: [PENDING, ACCEPTED, IN_PROGRESS, REJECTED, CANCELLED, COMPLETED, FAILED, RETURNED]
 *           example: "COMPLETED"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         deliveryType:
 *           type: string
 *           enum: [INSTANT_DELIVERY, SCHEDULED_DELIVERY]
 *           example: "INSTANT_DELIVERY"
 *         dropLocation:
 *           type: string
 *           nullable: true
 *           example: "123 Main St, San Francisco, CA 94102"
 *     PaginationMetadata:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *           example: 1
 *         totalPages:
 *           type: integer
 *           example: 5
 *         totalCount:
 *           type: integer
 *           example: 47
 *         limit:
 *           type: integer
 *           example: 10
 *         hasNextPage:
 *           type: boolean
 *           example: true
 *         hasPrevPage:
 *           type: boolean
 *           example: false
 */

/**
 * @swagger
 * /customer/my-orders:
 *   get:
 *     summary: Get my orders with pagination
 *     description: Retrieves all orders for the authenticated customer with delivery details and dropoff location address. Orders are sorted by creation date in descending order (latest first).
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (starting from 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of orders per page (max 100)
 *     responses:
 *       200:
 *         description: Orders fetched successfully
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
 *                   example: "Orders fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderDetails'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMetadata'
 *       400:
 *         description: Bad request - Invalid pagination parameters
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
 *                   example: "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100"
 *       401:
 *         description: Unauthorized - User not authenticated
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
 *                   example: "Unauthorized: User not authenticated"
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
 *                   example: "Failed to fetch orders"
 */
router.get('/my-orders', authenticate, CustomerController.getMyOrders);

/**
 * @swagger
 * /customer/location-from-zip:
 *   get:
 *     summary: Get location details from zipcode
 *     description: Retrieves city, state, and country information for a given US zipcode using Google Maps Geocoding API
 *     tags: [Customer]
 *     parameters:
 *       - in: query
 *         name: zipcode
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{5}$'
 *           example: "94102"
 *         description: 5-digit US zipcode
 *     responses:
 *       200:
 *         description: Location fetched successfully
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
 *                   example: "Location fetched successfully"
 *                 data:
 *                   $ref: '#/components/schemas/ZipLocation'
 *       400:
 *         description: Bad request - Missing or invalid zipcode
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
 *                   example: "Invalid zipcode format. Must be 5 digits"
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
 *                   example: "Failed to fetch location"
 */
router.get('/location-from-zip', CustomerController.getLocationFromZip);

/**
 * @swagger
 * /customer/addresses:
 *   get:
 *     summary: Get all my addresses
 *     description: Retrieves all addresses for the authenticated customer
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
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
 *                   example: "Addresses retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CustomerAddress'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/addresses', authenticate, CustomerController.getMyAddresses);

/**
 * @swagger
 * /customer/addresses/default:
 *   get:
 *     summary: Get default address
 *     description: Retrieves the default address for the authenticated customer
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Default address retrieved successfully
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
 *                   example: "Default address retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/CustomerAddress'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No default address found
 *       500:
 *         description: Internal server error
 */
router.get('/addresses/default', authenticate, CustomerController.getMyDefaultAddress);

/**
 * @swagger
 * /customer/addresses/{id}:
 *   get:
 *     summary: Get address by ID
 *     description: Retrieves a specific address by ID for the authenticated customer
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address retrieved successfully
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
 *                   example: "Address retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/CustomerAddress'
 *       400:
 *         description: Bad request - Address ID required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Internal server error
 */
router.get('/addresses/:id', authenticate, CustomerController.getMyAddressById);

/**
 * @swagger
 * /customer/addresses:
 *   post:
 *     summary: Create a new address
 *     description: Creates a new address for the authenticated customer and sets isLocationSet to true
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAddressRequest'
 *     responses:
 *       201:
 *         description: Address created successfully
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
 *                   example: "Address created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/CustomerAddress'
 *       400:
 *         description: Bad request - Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/addresses', authenticate, CustomerController.createMyAddress);

/**
 * @swagger
 * /customer/addresses/{id}:
 *   patch:
 *     summary: Update an address
 *     description: Updates an existing address for the authenticated customer
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressLine1:
 *                 type: string
 *               addressLine2:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               lat:
 *                 type: number
 *                 format: double
 *               lng:
 *                 type: number
 *                 format: double
 *               addressType:
 *                 type: string
 *                 enum: [HOME, WORK, OTHER]
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated successfully
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
 *                   example: "Address updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/CustomerAddress'
 *       400:
 *         description: Bad request - Address ID required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Internal server error
 */
router.patch('/addresses/:id', authenticate, CustomerController.updateMyAddress);

/**
 * @swagger
 * /customer/addresses/{id}:
 *   delete:
 *     summary: Delete an address
 *     description: Deletes an address for the authenticated customer. If no addresses remain, sets isLocationSet to false
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
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
 *                   example: "Address deleted successfully"
 *       400:
 *         description: Bad request - Address ID required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Internal server error
 */
router.delete('/addresses/:id', authenticate, CustomerController.deleteMyAddress);

/**
 * @swagger
 * /customer/addresses/{id}/set-default:
 *   patch:
 *     summary: Set an address as default
 *     description: Sets an address as the default address for the authenticated customer
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Default address set successfully
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
 *                   example: "Default address set successfully"
 *                 data:
 *                   $ref: '#/components/schemas/CustomerAddress'
 *       400:
 *         description: Bad request - Address ID required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Address not found
 *       500:
 *         description: Internal server error
 */
router.patch('/addresses/:id/set-default', authenticate, CustomerController.setMyDefaultAddress);

export default router;