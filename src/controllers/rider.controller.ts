import type { Request, Response } from "express";
import { OnboardingLink } from "../utils/onboardingLink.util.js";
import { RiderService } from "../services/rider.service.js";
import { StripeConnectService } from "../services/stripeConnect.service.js";

/**
 * Rider controller
 */
export class RiderController {
    /**
     * Start rider KYC
     */
    static async getVehicleTypes(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId;
            if (!userId) {
                res.status(401).json({
                    success: false,
                });
                return;
            }
            const vehicleTypes = await RiderService.getVehicleTypes();

            res.status(200).json({
                success: true,
                message: 'Vehicle types retrieved successfully',
                data: vehicleTypes,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve vehicle types',
            });
        }
    }

    static async startRiderKyc(req: Request, res: Response): Promise<void> {
        try {
            const riderId = req.userId;

            if (!riderId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }

            const rider = await RiderService.getRiderById(riderId);

            let stripeAccountId = rider?.stripeAccountId;

            if (!stripeAccountId) {
                stripeAccountId = await StripeConnectService.createStripeExpressAccount(riderId);
            }

            const link = await OnboardingLink.generateOnboardingLink(stripeAccountId);

            res.status(200).json({
                success: true,
                message: 'Rider KYC started successfully',
                url: link.url,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to start rider KYC',
            });
        }
    }

    /**
     * Get rider verification status by user ID
     */
    static async getVerificationStatus(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.query.userId as string;

            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required',
                });
                return;
            }

            const verificationStatus = await RiderService.getRiderVerificationStatusByUserId(userId);

            res.status(200).json({
                success: true,
                message: 'Verification status fetched successfully',
                data: {
                    isVerified: verificationStatus,
                },
            });
        } catch (error: any) {
            console.error('Error fetching rider verification status:', error);
            res.status(404).json({
                success: false,
                message: error.message || 'Failed to fetch verification status',
            });
        }
    }

    /**
     * Update rider active status by user ID
     */
    static async updateActiveStatus(req: Request, res: Response): Promise<void> {
        try {
            const { userId, active } = req.body;

            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required',
                });
                return;
            }

            if (typeof active !== 'boolean') {
                res.status(400).json({
                    success: false,
                    message: 'active must be a boolean',
                });
                return;
            }

            const rider = await RiderService.updateRiderActiveStatusByUserId(userId, active);

            res.status(200).json({
                success: true,
                message: 'Rider active status updated successfully',
                data: rider,
            });
        } catch (error: any) {
            console.error('Error updating rider active status:', error);
            const statusCode = error.message === 'Rider not found' ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to update rider active status',
            });
        }
    }

    /**
     * Get rider total earnings by user ID
     */
    static async getTotalEarnings(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.query.userId as string;

            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required',
                });
                return;
            }

            const rider = await RiderService.getRiderTotalEarningsByUserId(userId);

            res.status(200).json({
                success: true,
                message: 'Rider total earnings fetched successfully',
                data: rider,
            });
        } catch (error: any) {
            console.error('Error fetching rider total earnings:', error);
            const statusCode = error.message === 'Rider not found' ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to fetch rider total earnings',
            });
        }
    }
}