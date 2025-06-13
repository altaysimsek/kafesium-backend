import { prisma } from '../lib/prisma.js';
import { hashPassword } from '../utils/password.utils.js';

// Hassas bilgileri çıkaran yardımcı fonksiyon
const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

export const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        include: {
          steamProfile: true,
        },
      });

      res.json({
        status: 'success',
        data: users.map(sanitizeUser),
      });
    } catch (error) {
      console.error('Kullanıcı listesi getirme hatası:', error);
      res.status(500).json({
        status: 'error',
        message: 'Kullanıcı listesi alınırken bir hata oluştu',
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: {
          steamProfile: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Kullanıcı bulunamadı',
        });
      }

      res.json({
        status: 'success',
        data: sanitizeUser(user),
      });
    } catch (error) {
      console.error('Kullanıcı getirme hatası:', error);
      res.status(500).json({
        status: 'error',
        message: 'Kullanıcı bilgileri alınırken bir hata oluştu',
      });
    }
  },

  createUser: async (req, res) => {
    try {
      const { email, password, name } = req.body;

      // Email kontrolü
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Bu email adresi zaten kullanılıyor',
        });
      }

      // Şifreyi hashle
      const hashedPassword = await hashPassword(password);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      // Hassas bilgileri çıkar
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        status: 'success',
        data: userWithoutPassword,
      });
    } catch (error) {
      console.error('Kullanıcı oluşturma hatası:', error);
      res.status(500).json({
        status: 'error',
        message: 'Kullanıcı oluşturulurken bir hata oluştu',
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { email, password, name, role } = req.body;

      // Kullanıcı kontrolü
      const existingUser = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingUser) {
        return res.status(404).json({
          status: 'error',
          message: 'Kullanıcı bulunamadı',
        });
      }

      // Email değişiyorsa ve başka bir kullanıcı tarafından kullanılıyorsa
      if (email && email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email },
        });

        if (emailExists) {
          return res.status(400).json({
            status: 'error',
            message: 'Bu email adresi zaten kullanılıyor',
          });
        }
      }

      // Güncelleme verilerini hazırla
      const updateData = {
        ...(email && { email }),
        ...(name && { name }),
        ...(role && { role }),
      };

      // Şifre değişiyorsa hashle
      if (password) {
        updateData.password = await hashPassword(password);
      }

      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      // Hassas bilgileri çıkar
      const { password: _, ...userWithoutPassword } = updatedUser;

      res.json({
        status: 'success',
        data: userWithoutPassword,
      });
    } catch (error) {
      console.error('Kullanıcı güncelleme hatası:', error);
      res.status(500).json({
        status: 'error',
        message: 'Kullanıcı güncellenirken bir hata oluştu',
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      // Kullanıcı kontrolü
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({
          status: 'error',
          message: 'Kullanıcı bulunamadı',
        });
      }

      await prisma.user.delete({
        where: { id: userId },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Kullanıcı silinirken hata:', error);
      res.status(500).json({
        status: 'error',
        message: 'Kullanıcı silinirken bir hata oluştu',
      });
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'Giriş yapılmamış',
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          steamProfile: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Kullanıcı bulunamadı',
        });
      }

      res.json({
        status: 'success',
        data: sanitizeUser(user),
      });
    } catch (error) {
      console.error('Kullanıcı bilgileri getirme hatası:', error);
      res.status(500).json({
        status: 'error',
        message: 'Kullanıcı bilgileri alınırken bir hata oluştu',
      });
    }
  },
}; 