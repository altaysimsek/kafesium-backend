# Build aşaması
FROM node:20-alpine AS builder

WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
RUN npm ci

# Kaynak kodları kopyala
COPY . .

# Prisma client'ı generate et
RUN npx prisma generate

# Production aşaması
FROM node:20-alpine AS production

WORKDIR /app

# Sadece gerekli dosyaları kopyala
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./.env

# Production ortamını ayarla
ENV NODE_ENV=production

# Uygulama portunu aç
EXPOSE 8000

# Uygulamayı başlat
CMD ["npm", "start"] 