import { stripe } from "../config/stripe.config.js";
import { env } from "../config/env.config.js";

export class OnboardingLink {
    /**
     * Generate Stripe onboarding link for rider KYC
     */
    static async generateOnboardingLink(stripeAccountId: string): Promise<{ url: string }> {
        try {
            const link = await stripe.accountLinks.create({
                account: stripeAccountId,
                refresh_url: env.stripe_refresh_url,
                return_url: env.stripe_return_url,
                type: "account_onboarding",
            });

            if (!link) {
                throw new Error("Failed to generate onboarding link. Please try again.");
            }

            return { url: link.url };
        } catch (error: any) {
            throw new Error(error.message || "Failed to generate onboarding link. Please try again.");
        }
    }
}
