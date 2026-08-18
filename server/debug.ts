import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.userProfile.findMany();
  console.log(users);
}
main().finally(() => prisma.$disconnect());
