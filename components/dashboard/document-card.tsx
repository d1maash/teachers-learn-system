import Link from "next/link";
import { DocumentStatus } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const statusText: Record<DocumentStatus, string> = {
  UPLOADED: "Загружено",
  PROCESSING: "Обработка",
  READY: "Готово",
  ERROR: "Ошибка"
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
  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle className="text-xl font-light">{document.title}</CardTitle>
        <p className="text-sm text-foreground/60">{document.originalFileName}</p>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-sm uppercase tracking-widest text-foreground/60">
          {statusText[document.status]}
        </span>
        {document.status === DocumentStatus.READY && document.quizId && (
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href={`/quizzes/${document.quizId}`}>Открыть</Link>
            </Button>
            <Button asChild>
              <Link href={`/quizzes/${document.quizId}/present`}>Показать</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

