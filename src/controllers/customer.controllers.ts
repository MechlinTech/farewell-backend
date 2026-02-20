import type { Request, Response } from 'express';
import { CustomerService } from '../services/customer.service.js';

export class CustomerController {
    /**
     * Get my orders with pagination and delivery details
     */
    static async getMyOrders(req: Request, res: Response): Promise<void> {
        try {
            const customerId = req.userId;

            if (!customerId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized: User not authenticated',
                });
                return;
            }

            // Get pagination parameters from query
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            // Validate pagination parameters
            if (page < 1 || limit < 1 || limit > 100) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100',
                });
                return;
            }

            const result = await CustomerService.getMyOrders(customerId, { page, limit });

            res.status(200).json({
                success: true,
                message: 'Orders fetched successfully',
                data: result.orders,
                pagination: result.pagination,
            });
        } catch (error: any) {
            console.error('Error fetching customer orders:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch orders',
            });
        }
    }

    /**
     * Get location from zipcode
     */
    static async getLocationFromZip(req: Request, res: Response): Promise<void> {
        try {
            const zipcode = req.query.zipcode as string;

            if (!zipcode) {
                res.status(400).json({
                    success: false,
                    message: 'Zipcode is required',
                });
                return;
            }

            // Validate zipcode format (5 digits)
            if (!/^\d{5}$/.test(zipcode)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid zipcode format. Must be 5 digits',
                });
                return;
            }

            const location = await CustomerService.getLocationFromZipcode(zipcode);

            res.status(200).json({
                success: true,
                message: 'Location fetched successfully',
                data: location,
            });
        } catch (error: any) {
            console.error('Error fetching location from zipcode:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch location',
            });
        }
    }

    /**
     * Get all my addresses
     */
    static async getMyAddresses(req: Request, res: Response): Promise<void> {
        try {
            const customerId = req.userId;

            if (!customerId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized: User not authenticated',
                });
                return;
            }

            const addresses = await CustomerService.getMyAddresses(customerId);

            res.status(200).json({
                success: true,
                message: 'Addresses retrieved successfully',
                data: addresses,
            });
        } catch (error: any) {
            console.error('Error fetching addresses:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch addresses',
            });
        }
    }

    /**
     * Get address by ID
     */
    static async getMyAddressById(req: Request, res: Response): Promise<void> {
        try {
            const customerId = req.userId;
            const addressId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

            if (!customerId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized: User not authenticated',
                });
                return;
            }

            if (!addressId) {
                res.status(400).json({
                    success: false,
                    message: 'Address ID is required',
                });
                return;
            }

            const address = await CustomerService.getMyAddressById(addressId, customerId);

            res.status(200).json({
                success: true,
                message: 'Address retrieved successfully',
                data: address,
            });
        } catch (error: any) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
                return;
            }

            console.error('Error fetching address:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch address',
            });
        }
    }

    /**
     * Get default address
     */
    static async getMyDefaultAddress(req: Request, res: Response): Promise<void> {
        try {
            const customerId = req.userId;

            if (!customerId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized: User not authenticated',
                });
                return;
            }

            const address = await CustomerService.getMyDefaultAddress(customerId);

            res.status(200).json({
                success: true,
                message: 'Default address retrieved successfully',
                data: address,
            });
        } catch (error: any) {
            if (error.message.includes('No default address')) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
                return;
            }

            console.error('Error fetching default address:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch default address',
            });
        }
    }

    /**
     * Create my address
     */
    static async createMyAddress(req: Request, res: Response): Promise<void> {
        try {
            const customerId = req.userId;

            if (!customerId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized: User not authenticated',
                });
                return;
            }

            const {
                addressLine1,
                addressLine2,
                city,
                state,
                country,
                postalCode,
                lat,
                lng,
                addressType,
                isDefault,
            } = req.body;

            if (!addressLine1 || !city || !state || !country || !postalCode || lat === undefined || lng === undefined || !addressType) {
                res.status(400).json({
                    success: false,
                    message: 'Missing required fields: addressLine1, city, state, country, postalCode, lat, lng, addressType',
                });
                return;
            }

            const address = await CustomerService.createMyAddress({
                userId: customerId,
                addressLine1,
                addressLine2,
                city,
                state,
                country,
                postalCode,
                lat: Number(lat),
                lng: Number(lng),
                addressType,
                isDefault,
            });

            res.status(201).json({
                success: true,
                message: 'Address created successfully',
                data: address,
            });
        } catch (error: any) {
            console.error('Error creating address:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create address',
            });
        }
    }

    /**
     * Update my address
     */
    static async updateMyAddress(req: Request, res: Response): Promise<void> {
        try {
            const customerId = req.userId;
            const addressId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

            if (!customerId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized: User not authenticated',
                });
                return;
            }

            if (!addressId) {
                res.status(400).json({
                    success: false,
                    message: 'Address ID is required',
                });
                return;
            }

            const {
                addressLine1,
                addressLine2,
                city,
                state,
                country,
                postalCode,
                lat,
                lng,
                addressType,
                isDefault,
            } = req.body;

            const address = await CustomerService.updateMyAddress(addressId, customerId, {
                addressLine1,
                addressLine2,
                city,
                state,
                country,
                postalCode,
                lat: lat !== undefined ? Number(lat) : undefined,
                lng: lng !== undefined ? Number(lng) : undefined,
                addressType,
                isDefault,
            });

            res.status(200).json({
                success: true,
                message: 'Address updated successfully',
                data: address,
            });
        } catch (error: any) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
                return;
            }

            console.error('Error updating address:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to update address',
            });
        }
    }

    /**
     * Delete my address
     */
    static async deleteMyAddress(req: Request, res: Response): Promise<void> {
        try {
            const customerId = req.userId;
            const addressId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

            if (!customerId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized: User not authenticated',
                });
                return;
            }

            if (!addressId) {
                res.status(400).json({
                    success: false,
                    message: 'Address ID is required',
                });
                return;
            }

            const result = await CustomerService.deleteMyAddress(addressId, customerId);

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error: any) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
                return;
            }

            console.error('Error deleting address:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to delete address',
            });
        }
    }

    /**
     * Set default address
     */
    static async setMyDefaultAddress(req: Request, res: Response): Promise<void> {
        try {
            const customerId = req.userId;
            const addressId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

            if (!customerId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized: User not authenticated',
                });
                return;
            }

            if (!addressId) {
                res.status(400).json({
                    success: false,
                    message: 'Address ID is required',
                });
                return;
            }

            const address = await CustomerService.setMyDefaultAddress(addressId, customerId);

            res.status(200).json({
                success: true,
                message: 'Default address set successfully',
                data: address,
            });
        } catch (error: any) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
                return;
            }

            console.error('Error setting default address:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to set default address',
            });
        }
    }
}
