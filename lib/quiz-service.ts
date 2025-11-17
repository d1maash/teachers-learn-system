import { DocumentStatus, FileType } from "@prisma/client";
import { prisma } from "./db";
import { extractTextFromFile } from "./parsing";
import { getQuizGenerator } from "./ai";

export async function processDocument(documentId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { quiz: true }
  });

  if (!document) {
    throw new Error("Документ не найден");
  }

  if (document.quiz) {
    return document.quiz;
  }

  await prisma.document.update({
    where: { id: documentId },
    data: { status: DocumentStatus.PROCESSING }
  });

  try {
    const text = await extractTextFromFile(document.storagePath);
    if (!text) {
      throw new Error("Не удалось извлечь текст из документа");
    }

    const generator = getQuizGenerator();
    const quiz = await generator.generateQuizFromText(text);

    const createdQuiz = await prisma.quiz.create({
      data: {
        documentId: document.id,
        title: quiz.quizTitle || document.title,
        questions: {
          create: quiz.questions.map((question, idx) => ({
            text: question.text,
            order: idx + 1,
            options: {
              create: question.options.map((option) => ({
                text: option.text,
                isCorrect: option.isCorrect
              }))
            }
          }))
        }
      },
      include: {
        questions: {
          include: { options: true },
          orderBy: { order: "asc" }
        }
      }
    });

    await prisma.document.update({
      where: { id: documentId },
      data: { status: DocumentStatus.READY }
    });

    return createdQuiz;
  } catch (error) {
    await prisma.document.update({
      where: { id: documentId },
      data: { status: DocumentStatus.ERROR }
    });
    throw error;
  }
}

export function resolveFileTypeFromName(filename: string): FileType {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return FileType.PDF;
    case "ppt":
      return FileType.PPT;
    case "pptx":
      return FileType.PPTX;
    case "doc":
      return FileType.DOC;
    case "docx":
      return FileType.DOCX;
    default:
      return FileType.OTHER;
  }
}

