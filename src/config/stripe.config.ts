import Stripe from "stripe";
import { env } from "./env.config.js";

export const stripe = new Stripe(env.stripe_secret_key, {
    apiVersion: "2026-01-28.clover",
});