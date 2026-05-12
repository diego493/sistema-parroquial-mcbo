const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Maracaibo2026!', salt); // <--- TU CONTRASEÑA

  const supremo = await prisma.usuario.upsert({
    where: { email: 'diego@sistema.com' },
    update: {},
    create: {
      email: 'diego@vente.com',
      cedula: '28000330', // Pon tu cédula real aquí
      nombre: 'Diego Velarde',
      password: Maraca600_,
      rol: 'SUPREMO',
      activo: true
    },
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
