import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email || !session.user.id) {
    redirect("/auth/login");
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      name: true,
      profileCompleted: true
    }
  });

  if (!teacher) {
    redirect("/auth/login");
  }

  if (!teacher.profileCompleted) {
    redirect("/onboarding");
  }

  return (
    <AppShell teacherEmail={teacher.email} teacherName={teacher.name}>
      {children}
    </AppShell>
  );
}

