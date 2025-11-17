import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_TEACHER_EMAIL;
  const password = process.env.SEED_TEACHER_PASSWORD;

  if (!email || !password) {
    console.warn(
      "Пропущены SEED_TEACHER_EMAIL/SEED_TEACHER_PASSWORD. Сидирование пропущено."
    );
    return;
  }

  const existing = await prisma.teacher.findUnique({ where: { email } });

  if (existing) {
    console.log("Учитель уже существует, пропускаю сидирование.");
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  await prisma.teacher.create({
    data: {
      email,
      passwordHash: hash,
      name: "Demo Teacher"
    }
  });

  console.log("Демонстрационный учитель создан.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

