import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data in a safe order to satisfy foreign keys.
  await prisma.$transaction([
    prisma.task.deleteMany(),
    prisma.user.deleteMany(),
  ]);

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
            title: 'Plan weekend trip',
            description: 'Pick a destination, budget, and travel dates.',
            status: 'completed',
          },
          {
            title: 'Grocery run',
            description: 'Buy staples for the week and restock pantry items.',
            status: 'pending',
          },
          {
            title: 'Gym session',
            description: 'Complete a 45-minute workout and stretch after.',
            status: 'pending',
          },
          {
            title: 'Call parents',
            description: 'Check in and share updates from this week.',
            status: 'completed',
          },
          {
            title: 'Sort closet',
            description: 'Donate clothes that have not been worn this year.',
            status: 'pending',
          },
          {
            title: 'Pay utility bills',
            description: 'Electricity and water bills due this week.',
            status: 'pending',
          },
          {
            title: 'Schedule dentist appointment',
            description: 'Book a routine checkup for next month.',
            status: 'completed',
          },
          {
            title: 'Meal prep',
            description: 'Cook lunches for the next three days.',
            status: 'pending',
          },
          {
            title: 'Organize photos',
            description: 'Back up and sort last month’s photos.',
            status: 'pending',
          },
          {
            title: 'Read a book chapter',
            description: 'Finish one chapter before bed.',
            status: 'completed',
          },
          {
            title: 'Car maintenance',
            description: 'Check tire pressure and top up washer fluid.',
            status: 'pending',
          },
          {
            title: 'Plan birthday gift',
            description: 'Order a gift and write a card.',
            status: 'completed',
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
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
