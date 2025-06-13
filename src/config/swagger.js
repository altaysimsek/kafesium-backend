import swaggerJsdoc from 'swagger-jsdoc';

const PORT = process.env.PORT || 8000;

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kafesium API',
      version: '1.0.0',
      description: 'Kafesium Backend API Dokümantasyonu',
      contact: {
        name: 'Kafesium',
        url: 'https://kafesium.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Geliştirme Sunucusu',
      },
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Kullanıcı ID',
            },
            email: {
              type: 'string',
              description: 'Kullanıcı email adresi',
            },
            name: {
              type: 'string',
              description: 'Kullanıcı adı',
            },
            steamId: {
              type: 'string',
              description: 'Steam ID',
            },
            role: {
              type: 'string',
              enum: ['NORMAL', 'ADMIN'],
              description: 'Kullanıcı rolü',
            },
            steamProfile: {
              type: 'object',
              properties: {
                displayName: {
                  type: 'string',
                  description: 'Steam kullanıcı adı',
                },
                avatar: {
                  type: 'string',
                  description: 'Steam profil resmi URL',
                },
                profileUrl: {
                  type: 'string',
                  description: 'Steam profil URL',
                },
                country: {
                  type: 'string',
                  description: 'Ülke kodu',
                },
                lastLogin: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Son giriş tarihi',
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Oluşturulma tarihi',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Güncellenme tarihi',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'Bir hata oluştu',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
}); 