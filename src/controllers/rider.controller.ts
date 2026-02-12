import type { Request, Response } from "express";
import { OnboardingLink } from "../utils/onboardingLink.js";
import { RiderService } from "../services/rider.service.js";
import { StripeConnectService } from "../services/stripeConnect.service.js";

/**
 * Rider controller
 */
export class RiderController {
    /**
     * Start rider KYC
     */
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
}