import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { ContactController } from "../controllers/user.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact message management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
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
 *         name:
 *           type: string
 *           example: "Abhijon"
 *         emailId:
 *           type: string
 *           example: "abhijon@gmail.com"
 *         category:
 *           type: string
 *           enum:
 *             - PAYMENT_AND_REFUND
 *             - DELIVERY_AND_RIDER
 *             - ACCOUNT_AND_VERIFICATION
 *             - TECHNICAL_ISSUES
 *             - SAFETY_FRAUD_AND_POLICY
 *           example: DELIVERY_AND_RIDER
 *         message:
 *           type: string
 *           example: "Need help with delivery"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *
 *     CreateContactRequest:
 *       type: object
 *       required:
 *         - name
 *         - message
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           example: "Abhijon"
 *         category:
 *           type: string
 *           enum:
 *             - PAYMENT_AND_REFUND
 *             - DELIVERY_AND_RIDER
 *             - ACCOUNT_AND_VERIFICATION
 *             - TECHNICAL_ISSUES
 *             - SAFETY_FRAUD_AND_POLICY
 *           example: DELIVERY_AND_RIDER
 *         message:
 *           type: string
 *           example: "I need help with my order"
 */

/**
 * @swagger
 * /contact/createmessage:
 *   post:
 *     summary: Create contact message
 *     description: Stores a contact message for the authenticated user. Email is taken from authentication token.
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateContactRequest'
 *     responses:
 *       201:
 *         description: Contact message created successfully
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
 *                   example: Contact message created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Duplicate message/email exists
 *       500:
 *         description: Internal server error
 */
router.post("/createmessage", authenticate, ContactController.createContact);

/**
 * @swagger
 * /contact/getmessagesbyuserid:
 *   get:
 *     summary: Get my contact messages
 *     description: Retrieves all contact messages for the authenticated user
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contacts fetched successfully
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
 *                   example: "Contacts fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/getmessagesbyuserid",
  authenticate,
  ContactController.getMyContacts,
);

/**
 * @swagger
 * /contact/getmessagesbyid/{id}:
 *   get:
 *     summary: Get logged in user message by ID
 *     description: Retrieves a specific contact message by ID for the authenticated user
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message fetched successfully
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
 *                   example: "Contact fetched successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Contact ID required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/getmessagesbyid/:id",
  authenticate,
  ContactController.getContactById,
);
/**
 * @swagger
 * /contact/getmessagesbyidadmin/{id}:
 *   get:
 *     summary: Get any message by ID(Admin Only)
 *     description: Retrieves a specific contact message by ID for the admin
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message fetched successfully
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
 *                   example: "Contact fetched successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Contact ID required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/getmessagesbyidadmin/:id",
  authenticate,
  authorize("ADMIN"),
  ContactController.getContactByIdadmin,
);

/**
 * @swagger
 * /contact/categories:
 *   get:
 *     summary: Get problem categories for contact form
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: Problem categories fetched successfully
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
 *                   example: Problem categories fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 550e8400-e29b-41d4-a716-446655440000
 *                       type:
 *                         type: string
 *                         example: PAYMENT_AND_REFUND
 *       500:
 *         description: Server error
 */
router.get("/categories", authenticate, ContactController.getProblemCategories);

/**
 * @swagger
 * /contact/allmessages:
 *   get:
 *     summary: Get all contact messages (Admin only)
 *     description: Retrieves all contact messages in the system. Only accessible by ADMIN users.
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All contact messages retrieved successfully
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
 *                   example: All contact messages retrieved
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Unauthorized — Token missing or invalid
 *       403:
 *         description: Forbidden — Only ADMIN can access
 *       500:
 *         description: Internal server error
 */
router.get("/allmessages",authenticate,authorize("ADMIN"),ContactController.getAllContacts);

export default router;
