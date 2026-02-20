import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config.js';
import mainRouter from './routes/index.routes.js';
import stripeWebhookRouter from './webhooks/stripe.webhook.js';

const app = express();

// Middleware
app.use(cors());
app.use("/webhooks", stripeWebhookRouter);
app.use(express.json());

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API routes will go here
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Farewell API' });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', mainRouter);

export default app;
