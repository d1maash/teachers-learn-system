import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Teacher Quiz Studio — Авторизация"
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center px-6">
        {children}
      </div>
    </div>
  );
}

