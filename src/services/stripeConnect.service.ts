import prisma from "../config/prisma.js";
import { stripe } from "../config/stripe.js";

export class StripeConnectService {
  /**
   * Create Stripe Express account for rider
   */
  static async createStripeExpressAccount(riderId: string): Promise<string> {
    const account = await stripe.accounts.create({
      type: "express",
      capabilities: {
        transfers: { requested: true },
      },
    });

    await prisma.rider.update({
      where: { id: riderId },
      data: { stripeAccountId: account.id },
    });

    return account.id;
  }
}
