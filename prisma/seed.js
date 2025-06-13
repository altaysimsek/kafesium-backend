import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Admin kullanıcısı oluştur
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@kafesium.com' },
    update: {},
    create: {
      email: 'admin@kafesium.com',
      name: 'Admin',
      role: 'ADMIN',
      password: 'admin123', // Gerçek uygulamada hash'lenmiş şifre kullanılmalı
    },
  });

  console.log({ adminUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 