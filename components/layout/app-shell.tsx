import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/server-actions";

type Props = {
  children: React.ReactNode;
  teacherEmail?: string | null;
};

export function AppShell({ children, teacherEmail }: Props) {
  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[320px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_65%)]" />
      <header className="sticky top-0 z-40 pb-4 pt-6">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-border bg-card/80 px-6 py-4 shadow-card backdrop-blur-xl">
            <Link href="/" className="text-2xl font-light tracking-wide">
              Whiteboard Quizzes
            </Link>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="text-left text-foreground/60">
                <p className="text-[0.65rem] uppercase tracking-[0.3em]">Преподаватель</p>
                <p className="font-medium text-foreground">{teacherEmail}</p>
              </div>
              <form action={signOutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Выйти
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>
      <main className={cn("mx-auto w-full max-w-6xl px-6 pb-16 pt-10 space-y-12 relative z-10")}>
        {children}
      </main>
    </div>
  );
}

