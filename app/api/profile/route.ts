import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { teacherProfileSchema } from "@/lib/auth/validators";
import { teacherProfileSelect } from "@/lib/profile/queries";

const normalizeOptional = (value?: string | null) => {
  if (value === undefined || value === null) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const normalizeTelegram = (value?: string | null) => {
  const normalized = normalizeOptional(value);
  if (!normalized) {
    return null;
  }
  return normalized.startsWith("@") ? normalized : `@${normalized}`;
};

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id: session.user.id },
    select: teacherProfileSelect
  });

  if (!teacher) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  }

  return NextResponse.json({ teacher });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = teacherProfileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Некорректные данные профиля" }, { status: 400 });
  }

  const data = parsed.data;

  const teacher = await prisma.teacher.update({
    where: { id: session.user.id },
    data: {
      name: data.name.trim(),
      subjects: data.subjects.trim(),
      university: data.university.trim(),
      phone: normalizeOptional(data.phone),
      telegram: normalizeTelegram(data.telegram),
      department: normalizeOptional(data.department),
      city: normalizeOptional(data.city),
      heardAboutUs: data.heardAboutUs,
      heardDetails: normalizeOptional(data.heardDetails),
      goals: normalizeOptional(data.goals),
      profileCompleted: true,
      profileCompletedAt: new Date()
    },
    select: teacherProfileSelect
  });

  return NextResponse.json({ teacher });
}


