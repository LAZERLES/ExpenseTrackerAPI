// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense Tracker API',
      version: '1.0.0',
      description: 'A RESTful API for managing personal expenses and income with user authentication, categories, and financial reports.',
      contact: {
        name: 'Poomrapee Koonyosying',
        email: 'poompepee@hotmail.com',
        url: 'https://github.com/LAZERLES'
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://your-api-url.onrender.com',  // Update when deployed
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token from login'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT token stored in HTTP-only cookie'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            username: { type: 'string', example: 'john_doe' },
            email: { type: 'string', example: 'john@example.com' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Food & Dining' },
            type: { type: 'string', enum: ['income', 'expense'], example: 'expense' },
            icon: { type: 'string', example: '🍔' },
            color: { type: 'string', example: '#FF6B6B' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Lunch at restaurant' },
            amount: { type: 'number', format: 'decimal', example: 150.00 },
            type: { type: 'string', enum: ['income', 'expense'], example: 'expense' },
            description: { type: 'string', example: 'Team lunch meeting' },
            category_id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            transaction_date: { type: 'string', format: 'date', example: '2024-11-23' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            Category: { $ref: '#/components/schemas/Category' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error message' }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'User registration and login' },
      { name: 'Transactions', description: 'Expense and income management' },
      { name: 'Categories', description: 'Transaction categories' }
    ]
  },
  apis: ['./Routes/*.js', './Controllers/*.js']  // Path to API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;