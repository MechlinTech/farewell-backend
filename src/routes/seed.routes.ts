import { Router } from 'express';
import { SeedController } from '../controllers/seed.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: FAQ
 *   description: Frequently Asked Questions management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FAQ:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: FAQ unique identifier
 *         question:
 *           type: string
 *           description: The question
 *           example: How do I schedule a pickup?
 *         answer:
 *           type: string
 *           description: The answer
 *           example: Choose pickup time, address and confirm booking.
 *         category:
 *           type: string
 *           enum: [GENERAL, PAYMENT, CUSTOMER, RIDER, OTHER]
 *           description: FAQ category
 *           example: GENERAL
 *         isActive:
 *           type: boolean
 *           description: Whether the FAQ is active
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: FAQ creation timestamp
 */

/**
 * @swagger
 * /faqs:
 *   get:
 *     summary: Get all FAQs
 *     description: Retrieves all active FAQs ordered by creation date (newest first)
 *     tags: [FAQ]
 *     responses:
 *       200:
 *         description: List of all active FAQs
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
 *                     $ref: '#/components/schemas/FAQ'
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
router.get('/', SeedController.getAll);

/**
 * @swagger
 * /faqs/category:
 *   get:
 *     summary: Get FAQs by category
 *     description: Retrieves active FAQs filtered by category
 *     tags: [FAQ]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *           enum: [GENERAL, PAYMENT, CUSTOMER, RIDER, OTHER]
 *         description: Filter FAQs by category
 *         example: GENERAL
 *     responses:
 *       200:
 *         description: Filtered FAQs retrieved successfully
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
 *                     $ref: '#/components/schemas/FAQ'
 *       400:
 *         description: Invalid category
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
 *                   example: Invalid category. Must be one of GENERAL, PAYMENT, CUSTOMER, RIDER, OTHER
 */
router.get('/category', SeedController.getByCategory);

/**
 * @swagger
 * /faqs/{id}:
 *   get:
 *     summary: Get FAQ by ID
 *     description: Retrieves a specific FAQ by its unique identifier
 *     tags: [FAQ]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: FAQ ID
 *     responses:
 *       200:
 *         description: FAQ found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FAQ'
 *       400:
 *         description: Invalid ID
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
 *       404:
 *         description: FAQ not found
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
 *                   example: FAQ not found
 */
router.get('/:id', SeedController.getById);

export default router;