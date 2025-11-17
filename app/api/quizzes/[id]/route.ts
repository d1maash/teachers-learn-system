import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

interface Params {
  params: { id: string };
}

export async function GET(_: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const quiz = await prisma.quiz.findFirst({
    where: {
      id: params.id,
      document: { teacherId: session.user.id }
    },
    include: {
      document: true,
      questions: {
        include: { options: true },
        orderBy: { order: "asc" }
      }
    }
  });

  if (!quiz) {
    return NextResponse.json({ error: "Викторина не найдена" }, { status: 404 });
  }

  return NextResponse.json({ quiz });
}

