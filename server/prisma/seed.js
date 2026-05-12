const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Maraca600_', 10);

  const supremo = await prisma.usuario.upsert({
    where: { email: 'diego@vente.com' },
    update: {},
    create: {
      email: 'diego@vente.com',
      cedula: '28000330',
      nombre: 'Diego Velarde',
      password: hashedPassword,
      rol: 'SUPREMO'
    }
  });

  console.log('✅ Usuario SUPREMO sembrado con éxito:', supremo.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
