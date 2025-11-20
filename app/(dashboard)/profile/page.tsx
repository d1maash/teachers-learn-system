import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileSettingsForm } from "@/components/profile/profile-settings-form";
import { mapTeacherToFormState } from "@/lib/profile/form";
import { teacherProfileSelect } from "@/lib/profile/queries";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id: session.user.id },
    select: teacherProfileSelect
  });

  if (!teacher) {
    redirect("/auth/login");
  }

  const initialData = mapTeacherToFormState(teacher);

  return (
    <div className="space-y-8">
      <section className="rounded-[40px] border border-border bg-card p-10 shadow-card">
        <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Профиль</p>
        <h1 className="mt-4 text-4xl font-light">Личные данные преподавателя</h1>
        <p className="mt-3 text-base text-foreground/60 max-w-2xl">
          Обновляйте контакты, университет и информацию о себе. Эти данные помогают нам быстрее
          реагировать на ваши запросы и улучшать качество генераций.
        </p>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Настройки профиля</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <ProfileSettingsForm initialData={initialData} submitLabel="Обновить профиль" />
        </CardContent>
      </Card>
    </div>
  );
}


