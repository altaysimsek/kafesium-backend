# Kafesium Backend

Modern bir Express.js API sunucusu.

## Özellikler

- Steam ile kimlik doğrulama
- Session tabanlı oturum yönetimi
- Prisma ile veritabanı yönetimi
- Swagger ile API dokümantasyonu
- CORS ve güvenlik yapılandırması
- Development ve Production ortam desteği

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme modunda çalıştır
npm run dev

# Prodüksiyon modunda çalıştır
npm start
```

## Ortam Değişkenleri

`.env` dosyasında aşağıdaki değişkenleri ayarlayın:

```env
# Genel Ayarlar
NODE_ENV=development
PORT=8000

# Frontend URL'leri
FRONTEND_URL=http://localhost:3000  # Development
# FRONTEND_URL=https://play.kafesium.com  # Production

# API URL'leri
API_URL=http://localhost:8000  # Development
# API_URL=https://api.kafesium.com  # Production

# Session
SESSION_SECRET=your-secure-secret-key

# Steam
STEAM_API_KEY=your-steam-api-key
STEAM_REALM=http://localhost:3000  # Development
# STEAM_REALM=https://play.kafesium.com  # Production

# Cookie
COOKIE_DOMAIN=localhost  # Development
# COOKIE_DOMAIN=.kafesium.com  # Production
```

## API Endpoints

### Kimlik Doğrulama
- `GET /api/auth/steam` - Steam ile giriş başlat
- `GET /api/auth/steam/callback` - Steam callback endpoint'i
- `GET /api/auth/me` - Mevcut kullanıcı bilgilerini getir
- `POST /api/auth/logout` - Çıkış yap

### Kullanıcılar
- `GET /api/users` - Tüm kullanıcıları listele
- `GET /api/users/:id` - Belirli bir kullanıcıyı getir
- `POST /api/users` - Yeni kullanıcı oluştur
- `PUT /api/users/:id` - Kullanıcı bilgilerini güncelle
- `DELETE /api/users/:id` - Kullanıcıyı sil

### Diğer
- `GET /api/health` - API sağlık kontrolü
- `GET /api-docs` - Swagger API dokümantasyonu

## Domain Yapılandırması

### Development
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Cookie Domain: `localhost`

### Production
- Frontend: `https://play.kafesium.com`
- Backend: `https://api.kafesium.com`
- Cookie Domain: `.kafesium.com`

## Güvenlik

- CORS yapılandırması ile sadece izin verilen origin'lerden gelen isteklere izin verilir
- Session cookie'leri güvenli bir şekilde yapılandırılmıştır
- Helmet.js ile güvenlik başlıkları
- Steam API entegrasyonu ile güvenli kimlik doğrulama

## Geliştirme Araçları

- Biome.js ile kod formatlaması ve linting
- Nodemon ile otomatik yeniden başlatma
- Express.js web framework'ü
- CORS, Helmet ve Morgan middleware'leri
- Prisma ORM
- Passport.js kimlik doğrulama
- Swagger UI API dokümantasyonu

## Frontend Entegrasyonu

Frontend uygulamanızda API isteklerini yaparken aşağıdaki yapılandırmayı kullanın:

```javascript
// Axios için
axios.defaults.baseURL = process.env.NODE_ENV === 'production'
  ? 'https://api.kafesium.com'
  : 'http://localhost:8000';
axios.defaults.withCredentials = true;

// Fetch için
fetch(`${API_URL}/api/auth/me`, {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

## Lisans

MIT 