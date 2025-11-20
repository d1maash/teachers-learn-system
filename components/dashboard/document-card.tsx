import Link from "next/link";
import { DocumentStatus } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusMeta: Record<
  DocumentStatus,
  { label: string; variant: "muted" | "warning" | "success" | "danger"; progress: number; helper: string }
> = {
  UPLOADED: {
    label: "Загружено",
    variant: "muted",
    progress: 0.25,
    helper: "Материал в очереди на обработку"
  },
  PROCESSING: {
    label: "Обработка",
    variant: "warning",
    progress: 0.6,
    helper: "Идёт генерация вопросов"
  },
  READY: {
    label: "Готово",
    variant: "success",
    progress: 1,
    helper: "Викторина доступна"
  },
  ERROR: {
    label: "Ошибка",
    variant: "danger",
    progress: 1,
    helper: "Не удалось обработать файл"
  }
};

type Props = {
  document: {
    id: string;
    title: string;
    status: DocumentStatus;
    originalFileName: string;
    createdAt: Date;
    quizId?: string | null;
  };
};

export function DocumentCard({ document }: Props) {
  const formattedDate = new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(document.createdAt);

  const status = statusMeta[document.status];
  const progressPercent = Math.round(status.progress * 100);

  return (
    <Card className="p-0">
      <CardHeader className="flex flex-col gap-4 border-b border-border px-8 py-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Материал</p>
          <CardTitle className="mt-2 text-2xl font-light">{document.title}</CardTitle>
          <p className="text-sm text-foreground/60">{document.originalFileName}</p>
        </div>
        <div className="text-left md:text-right">
          <Badge variant={status.variant}>{status.label}</Badge>
          <p className="mt-2 text-xs text-foreground/60">{status.helper}</p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 px-8 py-6 md:grid-cols-[1fr_auto] md:items-center">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between text-xs text-foreground/60">
            <span>Создано {formattedDate}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-foreground/10">
            <div
              className={cn(
                "h-full rounded-full transition-[width]",
                document.status === DocumentStatus.ERROR
                  ? "bg-red-500"
                  : document.status === DocumentStatus.READY
                    ? "bg-green-500"
                    : "bg-foreground"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        {document.status === DocumentStatus.READY && document.quizId ? (
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link href={`/quizzes/${document.quizId}`}>Открыть</Link>
            </Button>
            <Button asChild>
              <Link href={`/quizzes/${document.quizId}/present`}>Показать</Link>
            </Button>
          </div>
        ) : (
          <div className="text-sm text-foreground/60 md:text-right">
            {document.status === DocumentStatus.ERROR
              ? "Попробуйте повторно загрузить или свяжитесь с поддержкой."
              : "Мы уведомим вас, как только генерация завершится."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

