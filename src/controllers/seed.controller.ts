import type { Request, Response } from 'express';
import { SeedService } from '../services/seed.service.js';
import { Category } from '@prisma/client';

export class SeedController {
    static async getByCategory(req: Request, res: Response): Promise<void> {
        try {
            const { category } = req.query;

            // Validate category if provided
            if (category && typeof category === 'string') {
                if (!Object.values(Category).includes(category as Category)) {
                    res.status(400).json({
                        success: false,
                        message: `Invalid category. Must be one of: ${Object.values(Category).join(', ')}`,
                    });
                    return;
                }
            }

            const faqs = await SeedService.getByCategory(category as Category);
            res.status(200).json({ success: true, data: faqs });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const faqs = await SeedService.getAll();
            res.status(200).json({ success: true, data: faqs });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            if (!id) {
                res.status(400).json({ success: false, message: 'ID is required' });
                return;
            }

            const faq = await SeedService.getById(id);
            res.status(200).json({ success: true, data: faq });
        } catch (error: any) {
            if (error.message === 'FAQ not found') {
                res.status(404).json({ success: false, message: error.message });
            } else {
                res.status(400).json({ success: false, message: error.message });
            }
        }
    }
}