import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle>Создать аккаунт преподавателя</CardTitle>
        <p className="text-sm text-foreground/60">
          Подключите материалы и получайте готовые вопросы за минуты
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <RegisterForm />
        <p className="text-sm text-foreground/60 text-center">
          Уже есть доступ?{" "}
          <Link href="/auth/login" className="underline">
            Войти
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

