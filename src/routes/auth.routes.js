import express from 'express';
import passport from 'passport';
import { authenticateSteam } from '../middlewares/auth.middleware.js';

export const router = express.Router();

/**
 * @swagger
 * /api/auth/steam:
 *   get:
 *     summary: Steam ile giriş yap
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Steam login sayfasına yönlendirilir
 */
router.get('/steam', authenticateSteam);

/**
 * @swagger
 * /api/auth/steam/callback:
 *   get:
 *     summary: Steam login callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Steam login başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router.get('/steam/callback', authenticateSteam, (req, res) => {
  // Frontend'e yönlendir
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${req.user.id}`);
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Çıkış yap
 *     tags: [Auth]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Başarıyla çıkış yapıldı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Başarıyla çıkış yapıldı
 */
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Çıkış yapılırken bir hata oluştu',
      });
    }
    res.json({
      status: 'success',
      message: 'Başarıyla çıkış yapıldı',
    });
  });
}); 