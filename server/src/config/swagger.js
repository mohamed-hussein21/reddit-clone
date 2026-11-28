import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJsdoc from 'swagger-jsdoc';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Reddit Clone API', version: '1.0.0' },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    },
  },

  apis: [
  path.join(__dirname, '../docs/*.yaml').split(path.sep).join('/'),
  path.join(__dirname, '../routes/*.js').split(path.sep).join('/'),
  ],
});
