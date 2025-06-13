import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { validate, validateParams } from '../middlewares/validation.middleware.js';
import { createUserSchema, updateUserSchema, idSchema } from '../validations/user.validation.js';
import { authenticateSteam, isAuthenticated } from '../middlewares/auth.middleware.js';

export const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Tüm kullanıcıları listele
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Giriş yapılmamış
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Belirli bir kullanıcıyı getir
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Kullanıcı ID
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
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', validateParams(idSchema), userController.getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Yeni kullanıcı oluştur
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kullanıcı oluşturuldu
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
 *       400:
 *         description: Geçersiz istek
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', validate(createUserSchema), userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Kullanıcı bilgilerini güncelle
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Kullanıcı ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kullanıcı güncellendi
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
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', validateParams(idSchema), validate(updateUserSchema), userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Kullanıcıyı sil
 *     tags: [Users]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Kullanıcı ID
 *     responses:
 *       204:
 *         description: Kullanıcı silindi
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', validateParams(idSchema), userController.deleteUser);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Mevcut kullanıcının bilgilerini getir
 *     tags: [Users]
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
router.get('/me', isAuthenticated, userController.getCurrentUser);

/**
 * @swagger
 * /api/users/auth/steam:
 *   get:
 *     summary: Steam ile giriş yap
 *     tags: [Users]
 *     responses:
 *       302:
 *         description: Steam login sayfasına yönlendirilir
 */
router.get('/auth/steam', authenticateSteam);

/**
 * @swagger
 * /api/users/auth/steam/callback:
 *   get:
 *     summary: Steam login callback
 *     tags: [Users]
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
router.get('/auth/steam/callback', authenticateSteam, (req, res) => {
  // Frontend'e yönlendir
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${req.user.id}`);
}); 