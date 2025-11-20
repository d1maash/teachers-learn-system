import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UploadForm } from "@/components/upload/upload-form";

export default function UploadPage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[3fr,2fr]">
        <div className="rounded-[40px] border border-border bg-card p-10 shadow-card">
          <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Загрузка</p>
          <h1 className="mt-4 text-4xl font-light leading-tight">Материал для генерации вопросов</h1>
          <p className="mt-3 text-base text-foreground/60">
            Поддерживаем PDF, PowerPoint и Word — достаточно одной лекции или раздела учебника.
            Чем структурированнее материал, тем точнее вопросы.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-foreground/70">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-foreground" />
              <span>До 30 МБ на файл, несколько языков одновременно.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-foreground" />
              <span>Мы автоматически очистим форматирование и извлечём ключевые тезисы.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-foreground" />
              <span>Результат — минимум 10 вопросов с вариантами и правильным ответом.</span>
            </li>
          </ul>
        </div>
        <div className="rounded-[40px] border border-dashed border-border bg-background-secondary/70 p-8 text-sm text-foreground/70">
          <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Совет</p>
          <p className="mt-3 text-lg font-medium text-foreground">Лучше разделить курс на блоки</p>
          <p className="mt-2">
            Короткие файлы (10–15 страниц) дают более сфокусированные викторины и быстрее
            обрабатываются. Если нужен общий тест по курсу — загрузите сводный конспект.
          </p>
          <p className="mt-4 text-xs text-foreground/50">В обработке можно держать сразу несколько материалов.</p>
        </div>
      </section>
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

