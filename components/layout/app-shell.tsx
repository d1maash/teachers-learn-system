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
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
          <Link href="/" className="text-2xl font-light tracking-wide">
            Whiteboard Quizzes
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-foreground/60">{teacherEmail}</span>
            <form action={signOutAction}>
              <Button type="submit" variant="outline">
                Выйти
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className={cn("mx-auto w-full max-w-5xl px-6 py-12 space-y-12")}>
        {children}
      </main>
    </div>
  );
}

