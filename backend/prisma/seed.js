const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo users
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Admin User'
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'John Doe'
    }
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Jane Smith'
    }
  });

  console.log('✅ Users created');

  // Create demo project
  const project = await prisma.project.create({
    data: {
      name: 'Demo Project',
      description: 'A demo project for task management',
      ownerId: user1.id,
      members: {
        create: [
          { userId: user1.id, role: 'ADMIN' },
          { userId: user2.id, role: 'MEMBER' },
          { userId: user3.id, role: 'MEMBER' }
        ]
      }
    }
  });

  console.log('✅ Project created');

  // Create demo tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Setup database schema',
      description: 'Initialize PostgreSQL database with Prisma',
      projectId: project.id,
      createdById: user1.id,
      assignedToId: user2.id,
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Create API endpoints',
      description: 'Develop REST API routes for project management',
      projectId: project.id,
      createdById: user1.id,
      assignedToId: user3.id,
      status: 'TODO',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    }
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Write tests',
      description: 'Unit and integration tests for APIs',
      projectId: project.id,
      createdById: user2.id,
      assignedToId: user1.id,
      status: 'TODO',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    }
  });

  console.log('✅ Demo tasks created');
  console.log('✨ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
