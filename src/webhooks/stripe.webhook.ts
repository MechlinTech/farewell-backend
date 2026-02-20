import express from 'express';
import prisma from '../config/prisma.js';
import { stripe } from '../config/stripe.js';
import { Router } from 'express';
import { env } from '../config/env.js';

const router = Router();

router.post("/stripe", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"]!;
    const event = stripe.webhooks.constructEvent(req.body, sig, env.stripe_webhook_secret);
  
    if (event.type === "account.updated") {
      const account = event.data.object;
  
      const rider = await prisma.rider.findFirst({
        where: { stripeAccountId: account.id },
      });
  
      if (!rider) {
        res.status(200).json({
          success: true,
          message: 'Rider not found',
        });
        return;
      }
  
    const verified =
        account.details_submitted &&
        account.payouts_enabled &&
        account.charges_enabled;

    await prisma.rider.update({
        where: { id: rider.id },
        data: {
            isVerified: verified ? 'VERIFIED' : 'UNVERIFIED',
            bankDetails: account.payouts_enabled,
        },
    });
    }
  
    res.status(200).json({
      success: true,
      message: 'Stripe webhook received',
    });
  });

export default router;