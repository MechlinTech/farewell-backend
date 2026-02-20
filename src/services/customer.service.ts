import prisma from '../config/prisma.js';
import { deliveryType } from '@prisma/client';
import { getLocationFromZip } from '../utils/getLocationFromZip.js';

interface PaginationParams {
    page?: number;
    limit?: number;
}

export class CustomerService {
    /**
     * Get all orders for a customer with pagination and delivery details
     */
    static async getMyOrders(customerId: string, { page = 1, limit = 10 }: PaginationParams) {
        // Calculate pagination
        const skip = (page - 1) * limit;

        // Fetch orders with pagination
        const [orders, totalCount] = await Promise.all([
            prisma.deliveryRide.findMany({
                where: { customerId },
                select: {
                    orderId: true,
                    status: true,
                    createdAt: true,
                    deliveryType: true,
                    deliveryCartId: true,
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.deliveryRide.count({
                where: { customerId },
            }),
        ]);

        // Fetch delivery details and locations
        const ordersWithDetails = await Promise.all(
            orders.map(async (order) => {
                let dropLocation: string | null = null;

                // Fetch delivery cart details based on delivery type
                if (order.deliveryType === deliveryType.INSTANT_DELIVERY) {
                    const cart = await prisma.instantDeliveryCart.findUnique({
                        where: { id: order.deliveryCartId },
                        select: {
                            dropLocation: true,
                        },
                    });

                    if (cart) {
                        dropLocation = cart.dropLocation;
                    }
                } else if (order.deliveryType === deliveryType.SCHEDULED_DELIVERY) {
                    const cart = await prisma.scheduledDeliveryCart.findUnique({
                        where: { id: order.deliveryCartId },
                        select: {
                            dropLocation: true,
                        },
                    });

                    if (cart) {
                        dropLocation = cart.dropLocation;
                    }
                }

                return {
                    orderId: order.orderId,
                    status: order.status,
                    createdAt: order.createdAt,
                    deliveryType: order.deliveryType,
                    dropLocation,
                };
            })
        );

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return {
            orders: ordersWithDetails,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNextPage,
                hasPrevPage,
            },
        };
    }

    /**
     * Get location details from zipcode
     */
    static async getLocationFromZipcode(zipcode: string): Promise<{ city: string, state: string, country: string }> {
        const location = await getLocationFromZip(zipcode);
        return location;
    }

    /**
     * Get all addresses for a customer
     */
    static async getMyAddresses(customerId: string) {
        const addresses = await prisma.userAddress.findMany({
            where: { userId: customerId },
            orderBy: { createdAt: 'desc' },
        });

        return addresses;
    }

    /**
     * Get a specific address by ID for customer
     */
    static async getMyAddressById(addressId: string, customerId: string) {
        const address = await prisma.userAddress.findFirst({
            where: { 
                id: addressId,
                userId: customerId,
            },
        });

        if (!address) {
            throw new Error('Address not found');
        }

        return address;
    }

    /**
     * Get default address for customer
     */
    static async getMyDefaultAddress(customerId: string) {
        const address = await prisma.userAddress.findFirst({
            where: { 
                userId: customerId,
                isDefault: true,
            },
        });

        if (!address) {
            throw new Error('No default address found');
        }

        return address;
    }

    /**
     * Create a new address for customer and set isLocationSet to true
     */
    static async createMyAddress(data: {
        userId: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        lat: number;
        lng: number;
        addressType: 'HOME' | 'WORK' | 'OTHER';
        isDefault?: boolean;
    }) {
        // If this is set as default, unset other defaults
        if (data.isDefault) {
            await prisma.userAddress.updateMany({
                where: { 
                    userId: data.userId,
                    isDefault: true,
                },
                data: { isDefault: false },
            });
        }

        // Create the address
        const address = await prisma.userAddress.create({
            data: {
                userId: data.userId,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                city: data.city,
                state: data.state,
                country: data.country,
                postalCode: data.postalCode,
                lat: data.lat,
                lng: data.lng,
                addressType: data.addressType,
                isDefault: data.isDefault || false,
            },
        });

        // Set isLocationSet to true if it's false
        await prisma.user.update({
            where: { id: data.userId },
            data: { isLocationSet: true },
        });

        return address;
    }

    /**
     * Update a customer address
     */
    static async updateMyAddress(
        addressId: string,
        customerId: string,
        data: {
            addressLine1?: string;
            addressLine2?: string;
            city?: string;
            state?: string;
            country?: string;
            postalCode?: string;
            lat?: number;
            lng?: number;
            addressType?: 'HOME' | 'WORK' | 'OTHER';
            isDefault?: boolean;
        }
    ) {
        // Check if address exists and belongs to customer
        const existingAddress = await prisma.userAddress.findFirst({
            where: { 
                id: addressId,
                userId: customerId,
            },
        });

        if (!existingAddress) {
            throw new Error('Address not found');
        }

        // If this is set as default, unset other defaults
        if (data.isDefault) {
            await prisma.userAddress.updateMany({
                where: { 
                    userId: customerId,
                    isDefault: true,
                    id: { not: addressId },
                },
                data: { isDefault: false },
            });
        }

        const updatedAddress = await prisma.userAddress.update({
            where: { id: addressId },
            data,
        });

        return updatedAddress;
    }

    /**
     * Delete a customer address and update isLocationSet if no addresses remain
     */
    static async deleteMyAddress(addressId: string, customerId: string) {
        // Check if address exists and belongs to customer
        const existingAddress = await prisma.userAddress.findFirst({
            where: { 
                id: addressId,
                userId: customerId,
            },
        });

        if (!existingAddress) {
            throw new Error('Address not found');
        }

        // Delete the address
        await prisma.userAddress.delete({
            where: { id: addressId },
        });

        // Check if any other addresses exist for this user
        const remainingAddressCount = await prisma.userAddress.count({
            where: { userId: customerId },
        });

        // If no addresses remain, set isLocationSet to false
        if (remainingAddressCount === 0) {
            await prisma.user.update({
                where: { id: customerId },
                data: { isLocationSet: false },
            });
        }

        return { message: 'Address deleted successfully' };
    }

    /**
     * Set an address as default for customer
     */
    static async setMyDefaultAddress(addressId: string, customerId: string) {
        // Check if address exists and belongs to customer
        const existingAddress = await prisma.userAddress.findFirst({
            where: { 
                id: addressId,
                userId: customerId,
            },
        });

        if (!existingAddress) {
            throw new Error('Address not found');
        }

        // Unset other defaults
        await prisma.userAddress.updateMany({
            where: { 
                userId: customerId,
                isDefault: true,
            },
            data: { isDefault: false },
        });

        // Set this as default
        const updatedAddress = await prisma.userAddress.update({
            where: { id: addressId },
            data: { isDefault: true },
        });

        return updatedAddress;
    }
}