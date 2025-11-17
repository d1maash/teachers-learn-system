import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ToastNotificationsProvider } from "@/components/ui/use-toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"]
});

export const metadata: Metadata = {
  title: "Teacher Quiz Studio",
  description:
    "Минималистичная платформа для преподавателей по генерации тестов."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={cn(inter.className, "bg-background text-foreground")}>
        <ToastNotificationsProvider>{children}</ToastNotificationsProvider>
      </body>
    </html>
  );
}

