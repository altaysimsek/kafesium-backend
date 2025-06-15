import { prisma } from '../lib/prisma.js';

export const authController = {
  steamAuth: (req, res, next) => {
    // Steam ile giriş başlat
    req.session.returnTo = req.query.returnTo || '/';
    next();
  },

  steamCallback: (req, res) => {
    // Steam callback işlemi
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
  },

  getCurrentUser: (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Kullanıcı giriş yapmamış',
      });
    }

    res.json({
      status: 'success',
      data: {
        id: req.user.id,
        name: req.user.name,
        steamId: req.user.steamId,
      },
    });
  },

  logout: (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: 'Çıkış yapılırken bir hata oluştu',
        });
      }

      req.session.destroy(async(err) => {
        if (err) {
          return res.status(500).json({
            status: 'error',
            message: 'Çıkış yapılırken bir hata oluştu',
          });
        }
        try {
          await prisma.session.deleteMany({
            where: {
              userId: req.user.id,
            },
          });
        } catch (error) {
          console.error('Database session delete error:', error);
        }
        
        res.clearCookie('kafesium-sid');
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/`);
      });
    });
  },
};