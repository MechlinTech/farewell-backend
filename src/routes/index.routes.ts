import { Router } from 'express';
import authRoutes from './auth.routes.js';
import instantDeliveryRoutes from './instantDelivery.routes.js';
import faqRoutes from './seed.routes.js';
import userRoutes from './user.routes.js';

const mainRouter = Router();

mainRouter.use('/auth', authRoutes);
mainRouter.use('/instantDelivery', instantDeliveryRoutes);
mainRouter.use('/faqs', faqRoutes);
mainRouter.use('/users', userRoutes)

export default mainRouter;