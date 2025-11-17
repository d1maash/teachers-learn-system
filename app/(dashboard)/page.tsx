import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/session";
import { UploadCTA } from "@/components/dashboard/upload-cta";
import { DocumentCard } from "@/components/dashboard/document-card";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const documents = await prisma.document.findMany({
    where: { teacherId: session.user.id },
    include: { quiz: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-foreground/40">
          Панель преподавателя
        </p>
        <h1 className="text-5xl font-light leading-tight">
          Превратите материалы в готовые тесты.
        </h1>
        <p className="text-lg text-foreground/60">
          Просто загрузите презентацию или документ — мы подготовим минимум 10 вопросов
          с вариантами ответов.
        </p>
      </section>

      <UploadCTA />

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-light">Последние материалы</h2>
        </div>
        {documents.length === 0 && (
          <p className="text-foreground/60">Вы ещё не загрузили ни одного документа.</p>
        )}
        <div className="space-y-6">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={{
                id: document.id,
                title: document.title,
                status: document.status,
                originalFileName: document.originalFileName,
                createdAt: document.createdAt,
                quizId: document.quiz?.id
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

