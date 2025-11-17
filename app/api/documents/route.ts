import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const documents = await prisma.document.findMany({
    where: { teacherId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ documents });
}

