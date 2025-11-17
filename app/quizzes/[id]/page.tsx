import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/session";
import { QuizPreview } from "@/components/quiz/quiz-preview";

interface Params {
  params: { id: string };
}

export default async function QuizPage({ params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const quiz = await prisma.quiz.findFirst({
    where: {
      id: params.id,
      document: { teacherId: session.user.id }
    },
    include: {
      questions: {
        include: { options: true },
        orderBy: { order: "asc" }
      }
    }
  });

  if (!quiz) {
    notFound();
  }

  return <QuizPreview quiz={{ id: quiz.id, title: quiz.title, questions: quiz.questions }} />;
}

