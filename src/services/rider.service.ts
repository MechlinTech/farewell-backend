import prisma from "../config/prisma.js";

export class RiderService {
    /**
     * Get rider by id
     */
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
}