import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});

  // Create a user
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  });

  console.log('Created user:', user);

  // Create sample projects
  const projects = await prisma.project.createMany({
    data: [
      {
        title: 'AI-Powered Analytics Platform',
        description: 'Built a real-time analytics dashboard processing 10M+ events daily',
        tech: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
        userId: user.id,
      },
      {
        title: 'E-Commerce Microservices',
        description: 'Architected scalable microservices handling 50k concurrent users',
        tech: ['Go', 'Kubernetes', 'gRPC', 'MongoDB'],
        userId: user.id,
      },
      {
        title: 'Mobile Fitness App',
        description: 'Cross-platform app with 100k+ downloads and 4.8★ rating',
        tech: ['React Native', 'Firebase', 'TensorFlow'],
        userId: user.id,
      },
    ],
  });

  console.log('Created projects:', projects);

  // Fetch and display all projects
  const allProjects = await prisma.project.findMany({
    include: {
      user: true,
    },
  });

  console.log('All projects with users:');
  console.log(JSON.stringify(allProjects, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());

