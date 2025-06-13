import express from 'express';
import { router as userRouter } from './user.routes.js';
import { router as authRouter } from './auth.routes.js';

export const router = express.Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API çalışıyor',
    timestamp: new Date().toISOString(),
  });
}); 