import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UploadForm } from "@/components/upload/upload-form";

export default function UploadPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-foreground/40">
          Загрузка
        </p>
        <h1 className="text-4xl font-light">Материал для генерации вопросов</h1>
        <p className="text-foreground/60">
          Поддерживаем PDF, PowerPoint и Word. Минимализм и только чёрно-белая палитра.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Файл</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadForm />
        </CardContent>
      </Card>
    </div>
  );
}

