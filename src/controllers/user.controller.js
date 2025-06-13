import prisma from '../lib/prisma.js';

export const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          steamId: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({
        status: 'success',
        data: users,
      });
    } catch (error) {
      console.error('Kullanıcılar getirilirken hata:', error);
      res.status(500).json({
        status: 'error',
        message: 'Kullanıcılar getirilirken bir hata oluştu',
      });
    }
  },

  getUserById: async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          steamId: true,
          role: true,
          createdAt: true,
          updatedAt: true,
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
        data: user,
      });
    } catch (error) {
      console.error('Kullanıcı getirilirken hata:', error);
      res.status(500).json({
        status: 'error',
        message: 'Kullanıcı getirilirken bir hata oluştu',
      });
    }
  },

  createUser: async (req, res) => {
    try {
      const { email, name, password } = req.body;

      // Email kontrolü
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'Bu email adresi zaten kullanımda',
        });
      }

      const user = await prisma.user.create({
        data: {
          email,
          name,
          password, // Gerçek uygulamada şifre hash'lenmelidir
          role: 'NORMAL', // Varsayılan rol
        },
        select: {
          id: true,
          email: true,
          name: true,
          steamId: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(201).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      console.error('Kullanıcı oluşturulurken hata:', error);
      res.status(500).json({
        status: 'error',
        message: 'Kullanıcı oluşturulurken bir hata oluştu',
      });
    }
  },

  updateUser: async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { email, name, password, role } = req.body;

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

      // Email değişiyorsa ve başka bir kullanıcı tarafından kullanılıyorsa
      if (email && email !== existingUser.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email },
        });

        if (emailExists) {
          return res.status(400).json({
            status: 'error',
            message: 'Bu email adresi zaten kullanımda',
          });
        }
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          email,
          name,
          password, // Gerçek uygulamada şifre hash'lenmelidir
          role,
        },
        select: {
          id: true,
          email: true,
          name: true,
          steamId: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      console.error('Kullanıcı güncellenirken hata:', error);
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
}; 