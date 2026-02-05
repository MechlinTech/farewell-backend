import prisma from '../config/prisma.js';
import { Category } from '@prisma/client';

export class SeedService {
    static async getByCategory(category?: Category) {
        const where: any = { isActive: true };

        if (category) {
            // Validate category is a valid enum value
            if (!Object.values(Category).includes(category)) {
                throw new Error(`Invalid category. Must be one of: ${Object.values(Category).join(', ')}`);
            }
            where.category = category;
        }

        return prisma.faq.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                question: true,
                answer: true,
                category: true,
                isActive: true,
                createdAt: true,
            },
        });
    }

    static async getAll() {
        return prisma.faq.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                question: true,
                answer: true,
                category: true,
                isActive: true,
                createdAt: true,
            },
        });
    }

    static async getById(id: string) {
        const faq = await prisma.faq.findUnique({
            where: { id },
            select: {
                id: true,
                question: true,
                answer: true,
                category: true,
                isActive: true,
                createdAt: true,
            },
        });

        if (!faq) {
            throw new Error('FAQ not found');
        }

        return faq;
    }
}