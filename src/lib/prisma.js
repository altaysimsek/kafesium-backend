import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Veritabanı bağlantısını test et ve logla
prisma.$connect()
  .then(() => {
    console.log('✅ MySQL veritabanına başarıyla bağlanıldı');
  })
  .catch((error) => {
    console.error('❌ MySQL veritabanına bağlanırken hata oluştu:', error);
  });

export default prisma; 