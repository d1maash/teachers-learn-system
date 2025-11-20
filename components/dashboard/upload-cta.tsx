import Link from "next/link";
import { Button } from "@/components/ui/button";

const formats = ["PDF", "PowerPoint", "Word", "Документы на русском/англ"];

export function UploadCTA() {
  return (
    <div className="relative overflow-hidden rounded-[40px] border border-border bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#060a14] p-8 text-card shadow-card">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.3),_transparent_55%)]" />
      </div>
      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-card/70">Мгновенная генерация</p>
          <h2 className="text-3xl font-light leading-tight text-white">
            Загрузите материал и получите готовую викторину через пару минут.
          </h2>
          <div className="flex flex-wrap gap-3 text-xs text-card/70">
            {formats.map((format) => (
              <span
                key={format}
                className="rounded-full border border-white/20 px-4 py-2 uppercase tracking-[0.3em]"
              >
                {format}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 rounded-[28px] border border-white/15 bg-white/5 p-6 text-sm text-card/80 backdrop-blur">
          <p>Система автоматически извлечёт разделы, ключевые идеи и предложит 10+ вопросов.</p>
          <Button
            asChild
            className="w-full bg-white text-foreground hover:bg-white/90"
            variant="default"
          >
            <Link href="/upload">Начать загрузку</Link>
          </Button>
          <p className="text-xs text-card/60">Среднее время обработки — 45 секунд.</p>
        </div>
      </div>
    </div>
  );
}

