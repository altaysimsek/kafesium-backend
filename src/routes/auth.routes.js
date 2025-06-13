import express from 'express';
import passport from 'passport';
import { authController } from '../controllers/auth.controller.js';

export const router = express.Router();

/**
 * @swagger
 * /api/auth/steam:
 *   get:
 *     summary: Steam ile giriş başlat
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Steam giriş sayfasına yönlendirilir
 */
router.get('/steam', authController.steamAuth, passport.authenticate('steam'));

/**
 * @swagger
 * /api/auth/steam/callback:
 *   get:
 *     summary: Steam giriş callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Başarılı giriş sonrası yönlendirme
 *       401:
 *         description: Giriş başarısız
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/steam/callback',
  passport.authenticate('steam', { failureRedirect: '/login' }),
  authController.steamCallback
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Mevcut kullanıcı bilgilerini getir
 *     tags: [Auth]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı bilgileri
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
 *       401:
 *         description: Giriş yapılmamış
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', authController.getCurrentUser);

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
 *         description: Başarılı çıkış
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
router.post('/logout', authController.logout); 