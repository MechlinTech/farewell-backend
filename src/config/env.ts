import dotenv from "dotenv";

dotenv.config();

export const env = {
    db_url: process.env.DATABASE_URL!,
    port: process.env.PORT!,
    swagger_api_url: process.env.SWAGGER_API_URL!,
    node_env: process.env.NODE_ENV!,
    sendgrid_api_key: process.env.SENDGRID_API_KEY!,
    email_from: process.env.EMAIL_FROM!,
    jwt_secret: process.env.JWT_SECRET!,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
    jwt_expires_in: process.env.JWT_EXPIRES_IN!,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,
    map_url: process.env.MAP_URL!,
    googleMapsKey: process.env.GOOGLE_MAPS_API_KEY!,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
    platform_commission_percentage: process.env.PLATFORM_COMMISSION_PERCENTAGE!,
    payout_delay_hours: process.env.PAYOUT_DELAY_HOURS!,
    currency: process.env.CURRENCY!,
    stripe_refresh_url: process.env.STRIPE_REFRESH_URL!,
    stripe_return_url: process.env.STRIPE_RETURN_URL!,
};