import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { router as apiRouter } from './routes/index.js';
import './lib/prisma.js'; // Prisma bağlantısını başlat
import './config/passport.js';

// .env dosyasını yükle
dotenv.config();

const port = process.env.PORT || 3001;
const host = process.env.HOST || 'localhost';

// Swagger yapılandırması
const swaggerOptions = {
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
        url: `http://${host}:${port}`,
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
};

const specs = swaggerJsdoc(swaggerOptions);

const app = express();

// Session yapılandırması
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'gizli-anahtar',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 saat
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api', apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Bir şeyler ters gitti!',
  });
});

app.listen(port, () => {
  console.log(`Sunucu http://${host}:${port} adresinde çalışıyor`);
  console.log(`API Dokümantasyonu: http://${host}:${port}/api-docs`);
}); 