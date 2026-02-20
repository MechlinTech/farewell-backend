import prisma from '../config/prisma.config.js';

export class InstantDeliveryCartService {
    static async create(data: {
        customerId: string;
        pickupLat: number;
        pickupLng: number;
        dropLocation: string;
        price: number;
        tip?: number;
        quantity: number;
        size: 'SMALL' | 'MEDIUM' | 'LARGE';
        picture?: string;
    }) {
        const user = await prisma.user.findUnique({ where: { id: data.customerId } });
        if (!user) throw new Error('User not found');

        return prisma.instantDeliveryCart.create({ data });
    }

    static async getAll() {
        return prisma.instantDeliveryCart.findMany({
            include: { customer: { select: { id: true, firstName: true, lastName: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    static async getById(id: string) {
        return prisma.instantDeliveryCart.findUnique({
            where: { id },
            include: { customer: { select: { id: true, firstName: true, lastName: true } } },
        });
    }

    static async update(id: string, data: Partial<{
        pickupLat: number;
        pickupLng: number;
        dropLocation: string;
        price: number;
        tip: number;
        quantity: number;
        size: 'SMALL' | 'MEDIUM' | 'LARGE';
        picture?: string;
    }>) {
        const existing = await prisma.instantDeliveryCart.findUnique({ where: { id } });
        if (!existing) throw new Error('Cart not found');

        return prisma.instantDeliveryCart.update({ where: { id }, data });
    }

    static async delete(id: string) {
        const existing = await prisma.instantDeliveryCart.findUnique({ where: { id } });
        if (!existing) throw new Error('Cart not found');

        await prisma.instantDeliveryCart.delete({ where: { id } });
    }
}