import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { saveUploadedFile } from "@/lib/file-storage";
import { processDocument, resolveFileTypeFromName } from "@/lib/quiz-service";
import { DocumentStatus, FileType } from "@prisma/client";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const titleInput = formData.get("title") as string | null;

  if (!file) {
    return NextResponse.json({ error: "Файл обязателен" }, { status: 400 });
  }

  const title =
    titleInput && titleInput.trim().length > 0 ? titleInput.trim() : file.name ?? "Без названия";

  const buffer = Buffer.from(await file.arrayBuffer());
  const savedPath = await saveUploadedFile(buffer, file.name);
  const fileType = resolveFileTypeFromName(file.name);

  if (fileType === FileType.OTHER) {
    return NextResponse.json({ error: "Неподдерживаемый тип файла" }, { status: 400 });
  }

  const document = await prisma.document.create({
    data: {
      teacherId: session.user.id,
      title,
      originalFileName: file.name,
      fileType,
      storagePath: savedPath,
      status: DocumentStatus.UPLOADED
    }
  });

  try {
    const quiz = await processDocument(document.id);
    return NextResponse.json({ documentId: document.id, quizId: quiz.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ошибка обработки" },
      { status: 500 }
    );
  }
}

