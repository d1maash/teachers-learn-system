import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/auth/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }

  const { email, password, name } = parsed.data;

  const existing = await prisma.teacher.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Пользователь уже существует" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.teacher.create({
    data: { email, passwordHash, name: name?.trim() }
  });

  return NextResponse.json({ success: true });
}

