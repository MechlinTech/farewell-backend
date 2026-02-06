import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env.js';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Farewell API',
      version: '1.0.0',
      description: 'API for Farewell'
    },
    servers: [
      {
        url: `${env.swagger_api_url}`,
        description: `${env.node_env}`
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['src/routes/*.ts']
};

export const swaggerSpec = swaggerJSDoc(options);
