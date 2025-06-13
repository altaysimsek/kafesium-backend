import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Prisma bağlantısını test et
prisma.$connect()
  .then(() => {
    console.log('Prisma veritabanına başarıyla bağlandı');
  })
  .catch((error) => {
    console.error('Prisma veritabanı bağlantı hatası:', error);
    process.exit(1);
  });

// Uygulama kapatıldığında Prisma bağlantısını kapat
process.on('beforeExit', async () => {
  await prisma.$disconnect();
}); 