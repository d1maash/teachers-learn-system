import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle>Вход для преподавателей</CardTitle>
        <p className="text-sm text-foreground/60">
          Загружайте материалы и мгновенно получайте викторины
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <LoginForm />
        <p className="text-sm text-foreground/60 text-center">
          Нет аккаунта?{" "}
          <Link href="/auth/register" className="underline">
            Зарегистрируйтесь
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

