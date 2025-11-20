import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { OnboardingWizard } from "@/components/profile/onboarding-wizard";
import { mapTeacherToFormState } from "@/lib/profile/form";
import { teacherProfileSelect } from "@/lib/profile/queries";

export default async function OnboardingPage() {
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

  if (teacher.profileCompleted) {
    redirect("/");
  }

  const initialData = mapTeacherToFormState(teacher);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_60%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl items-center px-6 py-16">
        <OnboardingWizard initialData={initialData} teacherEmail={teacher.email} />
      </div>
    </div>
  );
}


