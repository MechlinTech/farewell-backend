import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

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
        url: `${process.env.SWAGGER_API_URL}`,
        description: `${process.env.NODE_ENV}`
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
