import type { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';

export class userController {
    /**
     * Common utility to extract userId from JWT token
     */
    private static getUserIdFromToken(req: Request): string | null {
        return req.userId || null;
    }

    /**
     * Get my location
     */
    static async getMyLocation(req: Request, res: Response): Promise<void> {
        try {
            const userId = userController.getUserIdFromToken(req);

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const location = await UserService.getLocationByUserId(userId);

            res.status(200).json({
                success: true,
                message: 'My location retrieved successfully',
                data: location,
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('No location found')) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to retrieve location',
            });
        }
    }

    /**
     * Create my location
     */
    static async createMyLocation(req: Request, res: Response): Promise<void> {
        try {
            const userId = userController.getUserIdFromToken(req);

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const { locationLat, locationLng } = req.body;

            if (locationLat === undefined || locationLng === undefined) {
                res.status(400).json({
                    success: false,
                    message: 'Location latitude and longitude are required',
                });
                return;
            }

            const location = await UserService.createLocation({
                userId,
                locationLat: Number(locationLat),
                locationLng: Number(locationLng),
            });

            res.status(201).json({
                success: true,
                message: 'My location created successfully',
                data: location,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to create location',
            });
        }
    }

    /**
     * Update my location
     */
    static async updateMyLocation(req: Request, res: Response): Promise<void> {
        try {
            const userId = userController.getUserIdFromToken(req);

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const { locationLat, locationLng } = req.body;

            const location = await UserService.updateLocationByUserId(userId, {
                locationLat: locationLat !== undefined ? Number(locationLat) : undefined,
                locationLng: locationLng !== undefined ? Number(locationLng) : undefined,
            });

            res.status(200).json({
                success: true,
                message: 'My location updated successfully',
                data: location,
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('Location not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update location',
            });
        }
    }

    /**
     * Delete my location
     */
    static async deleteMyLocation(req: Request, res: Response): Promise<void> {
        try {
            const userId = userController.getUserIdFromToken(req);

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const result = await UserService.deleteLocationByUserId(userId);

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('Location not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to delete location',
            });
        }
    }
}