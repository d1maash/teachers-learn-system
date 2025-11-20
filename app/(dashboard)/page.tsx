import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth/session";
import { UploadCTA } from "@/components/dashboard/upload-cta";
import { DocumentCard } from "@/components/dashboard/document-card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const documents = await prisma.document.findMany({
    where: { teacherId: session.user.id },
    include: { quiz: true },
    orderBy: { createdAt: "desc" }
  });

  const readyDocuments = documents.filter((doc) => doc.status === "READY").length;
  const inProgressDocuments = documents.filter(
    (doc) => doc.status === "PROCESSING" || doc.status === "UPLOADED"
  ).length;
  const lastUploadedAt = documents[0]?.createdAt;
  const formattedLastUpload = lastUploadedAt
    ? new Intl.DateTimeFormat("ru-RU", {
        dateStyle: "long",
        timeStyle: "short"
      }).format(lastUploadedAt)
    : "Ещё ни одного файла";

  const stats = [
    { label: "Всего материалов", value: documents.length, helper: "Ваши загруженные файлы" },
    { label: "Готовые викторины", value: readyDocuments, helper: "Можно запускать прямо сейчас" },
    { label: "В обработке", value: inProgressDocuments, helper: "AI всё ещё работает" }
  ];

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[48px] border border-border bg-card p-10 shadow-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(17,24,39,0.08),_transparent_60%)]" />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">
              Панель преподавателя
            </p>
            <h1 className="text-5xl font-light leading-tight">
              Превратите материалы в готовые тесты без ручной работы.
            </h1>
            <p className="text-base text-foreground/60">
              Загрузите презентацию или документ — мы проанализируем структуру и предложим минимум
              10 вопросов с вариантами ответов и правильным решением.
            </p>
          </div>
          <div className="rounded-[28px] border border-border bg-background-secondary/60 p-6 text-sm text-foreground/70 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Последняя загрузка</p>
            <p className="mt-2 text-lg font-medium text-foreground">{formattedLastUpload}</p>
            <p className="mt-1 text-xs">Старайтесь загружать материалы блоками, чтобы экономить время.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[28px] border border-border bg-background-secondary/70 px-6 py-5 text-sm text-foreground/70"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">{stat.label}</p>
              <p className="mt-3 text-4xl font-light text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs">{stat.helper}</p>
            </div>
          ))}
        </div>
      </section>

      <UploadCTA />

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Архив</p>
            <h2 className="text-3xl font-light">Последние материалы</h2>
          </div>
          <Button asChild variant="ghost" size="sm" className="rounded-full border border-border">
            <Link href="/upload">Загрузить файл</Link>
          </Button>
        </div>
        {documents.length === 0 ? (
          <div className="rounded-[36px] border border-dashed border-border bg-card/60 p-10 text-center">
            <p className="text-lg font-light">У вас пока нет материалов.</p>
            <p className="mt-2 text-sm text-foreground/60">
              Загрузите первый документ, чтобы увидеть прогресс и доступные викторины.
            </p>
            <Button asChild className="mt-6">
              <Link href="/upload">Создать первую викторину</Link>
            </Button>
          </div>
        ) : (
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
        )}
      </section>
    </div>
  );
}

