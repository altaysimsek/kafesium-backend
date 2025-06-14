import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import { prisma } from '../lib/prisma.js';

const STEAM_RETURN_URL = process.env.STEAM_RETURN_URL || 'http://localhost:3000/api/users/auth/steam/callback';

passport.use(
  new SteamStrategy(
    {
      returnURL: STEAM_RETURN_URL,
      realm: process.env.STEAM_REALM || 'http://localhost:3000/',
      apiKey: process.env.STEAM_API_KEY,
    },
    async (identifier, profile, done) => {
      try {
        // Steam ID'yi al
        const steamId = profile.id;

        // Kullanıcıyı bul veya oluştur
        let user = await prisma.user.findFirst({
          where: { steamId },
          include: {
            steamProfile: true,
          },
        });

        if (!user) {
          // Yeni kullanıcı oluştur
          user = await prisma.user.create({
            data: {
              steamId,
              name: profile.displayName,
              email: `${steamId}@steam.user`, // Geçici email
              role: 'NORMAL',
              steamProfile: {
                create: {
                  displayName: profile.displayName,
                  avatar: profile._json.avatarfull,
                  profileUrl: profile._json.profileurl,
                  country: profile._json.loccountrycode,
                },
              },
            },
            include: {
              steamProfile: true,
            },
          });
        } else {
          // Steam profilini güncelle
          await prisma.steamProfile.update({
            where: { userId: user.id },
            data: {
              displayName: profile.displayName,
              avatar: profile._json.avatarfull,
              profileUrl: profile._json.profileurl,
              country: profile._json.loccountrycode,
              lastLogin: new Date(),
            },
          });

          // Kullanıcı bilgilerini yeniden al
          user = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
              steamProfile: true,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        console.error('Steam authentication error:', error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // Önce session'ı kontrol et
    const session = await prisma.session.findFirst({
      where: {
        userId: id,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    // Eğer geçerli bir session yoksa, kullanıcıyı deserialize etme
    if (!session) {
      return done(null, false);
    }

    // Session varsa kullanıcıyı getir
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        steamProfile: true,
      },
    });

    // Kullanıcı bulunamazsa deserialize etme
    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
}); 