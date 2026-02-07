import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@example.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Upsert user
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Demo User',
      password: hashedPassword,
      tasks: {
        create: [
          {
            title: 'Complete the assignment',
            description: 'Finish the full-stack task management system track.',
            status: 'completed',
          },
          {
            title: 'Review code',
            description: 'Check for any linting errors and optimize performance.',
            status: 'pending',
          },
          {
            title: 'Deploy application',
            description: 'Deploy the backend and frontend to a hosting provider.',
            status: 'pending',
          },
        ],
      },
    },
  });

  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
