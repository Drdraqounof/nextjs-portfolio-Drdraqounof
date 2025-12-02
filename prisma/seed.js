import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      name: "Julien",
      email: "julien@example.com"
    }
  })
}

main()
  .then(() => console.log("Database seeded!"))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
