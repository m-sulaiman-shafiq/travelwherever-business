import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { randomUUID } from "crypto";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
 await prisma.role.createMany({
  data: [
    { id: randomUUID(), name: "Owner" },
    { id: randomUUID(), name: "Accountant" },
    { id: randomUUID(), name: "Employee" },
  ],
  skipDuplicates: true,
});

  console.log("Roles seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });