import { Router } from 'express';
import authRoutes from './auth.routes.js';
import instantDeliveryRoutes from './instantDelivery.routes.js';
import faqRoutes from './seed.routes.js';

const mainRouter = Router();

mainRouter.use('/auth', authRoutes);
mainRouter.use('/instantDelivery', instantDeliveryRoutes);
mainRouter.use('/faqs', faqRoutes);

export default mainRouter;