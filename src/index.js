import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { sessionConfig } from './config/session.js';
import './config/passport.js';

// Routes
import { router as userRouter } from './routes/user.routes.js';
import { router as authRouter } from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware'ler
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session ve Passport
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Bir hata oluştu',
  });
});

// Server'ı başlat
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
  console.log(`API Dokümantasyonu: http://localhost:${PORT}/api-docs`);
}); 