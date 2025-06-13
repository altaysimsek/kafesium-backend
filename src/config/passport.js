import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import prisma from '../lib/prisma.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new SteamStrategy(
    {
      returnURL: process.env.STEAM_RETURN_URL,
      realm: process.env.STEAM_REALM,
      apiKey: process.env.STEAM_API_KEY,
    },
    async (identifier, profile, done) => {
      try {
        // Steam ID'yi al
        const steamId = profile.id;

        // Kullanıcıyı bul veya oluştur
        let user = await prisma.user.findUnique({
          where: { steamId },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              steamId,
              name: profile.displayName,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
); 