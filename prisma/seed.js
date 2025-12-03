import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});

  // Create a user
  const user = await prisma.user.create({
    data: {
      name: 'Julien Daniel-Roane',
      email: 'jdani0066@launchpadphilly.org',
    },
  });

  console.log('Created user:', user);

  // Create sample projects
  const projects = await prisma.project.createMany({
    data: [
      {
        title: '3D Game Demo',
        description: 'Built a pseudo-3D interactive game using layered sprites and camera motion to create depth. Implemented custom mechanics, coordinate transforms, and collision effects.',
        tech: ['Scratch', 'Game Design', '3D Simulation', 'Animation'],
        userId: user.id,
      },
      {
        title: 'Fitness Website',
        description: 'Designed a modern, responsive website prototype with accessible UI elements. Created mobile and desktop versions for consistent cross-device experience.',
        tech: ['Figma', 'UI/UX Design', 'Responsive Design', 'Prototyping'],
        userId: user.id,
      },
      {
        title: 'Cooking Website',
        description: 'Developed a responsive recipe site with intuitive navigation and clean layout. Designed UI in Figma and built the front-end using HTML and CSS.',
        tech: ['HTML', 'CSS', 'Figma', 'Responsive Design'],
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

