import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/lib/server-actions";

const navLinks = [
  { href: "/", label: "Панель" },
  { href: "/upload", label: "Загрузки" },
  { href: "/profile", label: "Профиль" }
];

type Props = {
  children: React.ReactNode;
  teacherEmail?: string | null;
  teacherName?: string | null;
};

export function AppShell({ children, teacherEmail, teacherName }: Props) {
  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[320px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_65%)]" />
      <header className="sticky top-0 z-40 pb-4 pt-6">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-[32px] border border-border bg-card/80 px-6 py-5 shadow-card backdrop-blur-xl">
            <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:gap-10">
              <Link href="/" className="text-2xl font-light tracking-wide">
                Whiteboard Quizzes
              </Link>
              <nav className="flex flex-wrap gap-2 text-sm text-foreground/70">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-transparent px-4 py-1.5 transition hover:border-border hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="text-left text-foreground/60">
                <p className="text-[0.65rem] uppercase tracking-[0.3em]">Преподаватель</p>
                <p className="font-medium text-foreground">{teacherName ?? teacherEmail}</p>
                <p className="text-xs text-foreground/50">{teacherEmail}</p>
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

