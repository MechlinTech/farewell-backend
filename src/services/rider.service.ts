import prisma from "../config/prisma.config.js";

export class RiderService {
    /**
     * Get rider by id
     */

    static async getVehicleTypes() {
        const vehicleTypes = await prisma.vehicleTypes.findMany();
        return vehicleTypes;
    }

    static async getRiderById(riderId: string) {
        const rider = await prisma.rider.findUnique({ where: { id: riderId } });
        if (!rider) {
            throw new Error("Rider not found");
        }
        return rider;
    }

    /**
     * Get rider verification status by user id
     */
    static async getRiderVerificationStatusByUserId(userId: string) {
        const rider = await prisma.rider.findFirst({
            where: { userId },
            select: {
                isVerified: true,
            },
        });

        if (!rider) {
            throw new Error("Rider not found");
        }

        return rider.isVerified;
    }

    /**
     * Update rider active status by user id
     */
    static async updateRiderActiveStatusByUserId(userId: string, active: boolean) {
        const rider = await prisma.rider.findFirst({
            where: { userId },
            select: {
                id: true,
                isVerified: true,
                status: true,
            },
        });

        if (!rider) {
            throw new Error('Rider not found');
        }

        if (
            active === false
            && (rider.isVerified !== 'VERIFIED' || rider.status !== 'IDLE')
        ) {
            throw new Error('active can be false only when rider is VERIFIED and IDLE');
        }

        const updatedRider = await prisma.rider.update({
            where: { id: rider.id },
            data: { active },
            select: {
                userId: true,
                isVerified: true,
                status: true,
                active: true,
            },
        });

        return updatedRider;
    }

    /**
     * Get rider total earnings by user id
     */
    static async getRiderTotalEarningsByUserId(userId: string) {
        const rider = await prisma.rider.findFirst({
            where: { userId },
            select: {
                userId: true,
                totalEarnings: true,
            },
        });

        if (!rider) {
            throw new Error('Rider not found');
        }

        return rider;
    }
}