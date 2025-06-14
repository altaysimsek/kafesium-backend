import session from 'express-session';
import { prisma } from '../lib/prisma.js';

class PrismaSessionStore extends session.Store {
  constructor() {
    super();
  }

  async get(sid, callback) {
    try {
      const session = await prisma.session.findUnique({
        where: { id: sid },
        include: {
          user: {
            include: {
              steamProfile: true
            }
          }
        }
      });

      if (!session) {
        return callback(null, null);
      }

      if (session.expiresAt < new Date()) {
        await this.destroy(sid);
        return callback(null, null);
      }

      const sessionData = JSON.parse(session.data);
      // Kullanıcı bilgilerini session verisine ekle
      if (session.user) {
        sessionData.user = session.user;
      }

      callback(null, sessionData);
    } catch (error) {
      callback(error);
    }
  }

  async set(sid, session, callback) {
    try {
      const expiresAt = session.cookie.expires || new Date(Date.now() + 24 * 60 * 60 * 1000);
      const data = JSON.stringify(session);
      await prisma.session.upsert({
        where: { id: sid },
        update: {
          data,
          expiresAt,
          userId: session.passport?.user,
        },
        create: {
          id: sid,
          data,
          expiresAt,
          userId: session.passport?.user,
        },
      });

      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  async destroy(sid, callback) {
    try {
      // Önce session'ın var olup olmadığını kontrol et
      const existingSession = await prisma.session.findUnique({
        where: { id: sid },
      });

      if (existingSession) {
        await prisma.session.delete({
          where: { id: sid },
        });
      }

      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  async clear(callback) {
    try {
      await prisma.session.deleteMany({});
      callback(null);
    } catch (error) {
      callback(error);
    }
  }
}

export const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'kafesium-secret-key',
  resave: false,
  name: 'kafesium-sid',
  saveUninitialized: false,
  store: new PrismaSessionStore(),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 saat
    sameSite: 'lax'
  },
}; 