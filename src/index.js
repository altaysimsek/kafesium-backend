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
import { SteamOpenIdError, SteamOpenIdErrorType } from 'passport-steam-openid';

// Routes
import { router as userRouter } from './routes/user.routes.js';
import { router as authRouter } from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Trust proxy ayarı
app.set('trust proxy', 1);

// Middleware'ler
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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
  if (err instanceof SteamOpenIdError) {
    switch (err.code) {
      case SteamOpenIdErrorType.InvalidQuery:
          console.log('InvalidQuery');
      case SteamOpenIdErrorType.Unauthorized:
          console.log('Unauthorized');
      case SteamOpenIdErrorType.InvalidSteamId:
          console.log('InvalidSteamId');
      case SteamOpenIdErrorType.NonceExpired:
          console.log('NonceExpired');
    }
  }
  res.status(500).redirect(`${process.env.FRONTEND_URL}/auth/error`);
});

// Server'ı başlat
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
  console.log(`API Dokümantasyonu: http://localhost:${PORT}/api-docs`);
}); 