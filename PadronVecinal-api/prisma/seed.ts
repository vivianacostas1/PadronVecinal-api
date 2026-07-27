import { PrismaClient, RolUsuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando proceso de creación del administrador...');
  
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@padron.com' },
    update: {
      passwordHash: hashedPassword,
    },
    create: {
      nombre: 'Administrador',
      email: 'admin@padron.com',
      passwordHash: hashedPassword,
      rol: RolUsuario.administrador,
      activo: true,
    },
  });

  console.log('¡ÉXITO! Usuario administrador creado/actualizado:', admin.email);
}

main()
  .catch((e) => {
    console.error('ERROR CRITICO EN SEED:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });