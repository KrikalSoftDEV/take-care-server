import swaggerJSDoc from 'swagger-jsdoc';


const options = {
definition: {
openapi: '3.0.0',
info: {
title: 'API',
version: '1.0.0',
},
components: {
securitySchemes: {
bearerAuth: {
type: 'http',
scheme: 'bearer',
bearerFormat: 'JWT',
},
},
},
security: [{ bearerAuth: [] }],
},
apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;