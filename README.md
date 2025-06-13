# Kafesium Backend

Modern bir Express.js API sunucusu.

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme modunda çalıştır
npm run dev

# Prodüksiyon modunda çalıştır
npm start
```

## API Endpoints

- `GET /api/health` - API sağlık kontrolü
- `GET /api/users` - Tüm kullanıcıları listele
- `GET /api/users/:id` - Belirli bir kullanıcıyı getir
- `POST /api/users` - Yeni kullanıcı oluştur
- `PUT /api/users/:id` - Kullanıcı bilgilerini güncelle
- `DELETE /api/users/:id` - Kullanıcıyı sil

## Geliştirme Araçları

- Biome.js ile kod formatlaması ve linting
- Nodemon ile otomatik yeniden başlatma
- Express.js web framework'ü
- CORS, Helmet ve Morgan middleware'leri 