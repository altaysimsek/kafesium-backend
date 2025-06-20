import passport from 'passport';

export const authenticateSteam = passport.authenticate('steam-openid', { failureRedirect: '/' });

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    status: 'error',
    message: 'Bu işlem için giriş yapmanız gerekiyor',
  });
}; 