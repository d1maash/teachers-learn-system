"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { teacherProfileSchema } from "@/lib/auth/validators";
import {
  heardAboutUsChoices,
  heardAboutUsLabels,
  serializeProfileForm,
  type TeacherProfileFormState
} from "@/lib/profile/form";

type Props = {
  initialData: TeacherProfileFormState;
  teacherEmail: string;
};

const STEP_TITLES = [
  { title: "О преподавателе", description: "Контактные данные и специализация" },
  { title: "Университет", description: "Где вы преподаёте" },
  { title: "О сервисе", description: "Как узнали и чего ожидаете" }
];

export function OnboardingWizard({ initialData, teacherEmail }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [formState, setFormState] = useState<TeacherProfileFormState>(initialData);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const updateField = <Key extends keyof TeacherProfileFormState>(field: Key) => {
    return (value: string) => setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const isLastStep = step === STEP_TITLES.length - 1;

  const validateCurrentStep = () => {
    if (step === 0) {
      if (formState.name.trim().length < 2) {
        toast({
          title: "Введите имя",
          description: "Укажите полное имя преподавателя"
        });
        return false;
      }
      if (formState.subjects.trim().length < 3) {
        toast({
          title: "Укажите предметы",
          description: "Расскажите, что вы преподаёте"
        });
        return false;
      }
    }

    if (step === 1) {
      if (formState.university.trim().length < 2) {
        toast({
          title: "Укажите университет",
          description: "Это нужно для персонализации сервисов"
        });
        return false;
      }
    }

    if (step === 2) {
      if (!formState.heardAboutUs) {
        toast({
          title: "Выберите источник",
          description: "Нам важно понимать, что работает лучше всего"
        });
        return false;
      }
      if (
        formState.heardAboutUs === "other" &&
        formState.heardDetails.trim().length < 3
      ) {
        toast({
          title: "Расскажите подробнее",
          description: "Заполните поле «Детали»"
        });
        return false;
      }
      if (formState.goals && formState.goals.trim().length > 0 && formState.goals.trim().length < 10) {
        toast({
          title: "Добавьте немного деталей",
          description: "Опишите ожидания хотя бы в двух предложениях"
        });
        return false;
      }
    }

    return true;
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    if (!isLastStep) {
      setStep((prev) => prev + 1);
      return;
    }

    setSaving(true);

    const payload = serializeProfileForm(formState);
    const parsed = teacherProfileSchema.safeParse(payload);

    if (!parsed.success) {
      setSaving(false);
      toast({
        title: "Проверьте ответы",
        description: "Некоторые поля заполнены некорректно"
      });
      return;
    }

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data)
    });

    setSaving(false);

    if (!response.ok) {
      toast({
        title: "Не удалось завершить анкету",
        description: "Попробуйте снова или напишите в поддержку",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Профиль сохранён",
      description: "Теперь доступны все возможности платформы"
    });
    router.push("/");
    router.refresh();
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Полное имя *</Label>
              <Input
                id="name"
                value={formState.name}
                onChange={(event) => updateField("name")(event.target.value)}
                placeholder="Например, Светлана Назарова"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="subjects">Что вы преподаёте? *</Label>
              <Input
                id="subjects"
                value={formState.subjects}
                onChange={(event) => updateField("subjects")(event.target.value)}
                placeholder="Алгебра, аналитическая геометрия..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                value={formState.phone}
                onChange={(event) => updateField("phone")(event.target.value)}
                placeholder="+7 999 000-00-00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegram">Telegram</Label>
              <Input
                id="telegram"
                value={formState.telegram}
                onChange={(event) => updateField("telegram")(event.target.value)}
                placeholder="@teacher_support"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="university">Университет *</Label>
              <Input
                id="university"
                value={formState.university}
                onChange={(event) => updateField("university")(event.target.value)}
                placeholder="Название университета"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Факультет / кафедра</Label>
              <Input
                id="department"
                value={formState.department}
                onChange={(event) => updateField("department")(event.target.value)}
                placeholder="Факультет информационных технологий"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Город</Label>
              <Input
                id="city"
                value={formState.city}
                onChange={(event) => updateField("city")(event.target.value)}
                placeholder="Санкт-Петербург"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="heardAboutUs">Где вы узнали о нас? *</Label>
              <select
                id="heardAboutUs"
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                value={formState.heardAboutUs}
                onChange={(event) => updateField("heardAboutUs")(event.target.value)}
              >
                {heardAboutUsChoices.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="heardDetails">
                Детали {formState.heardAboutUs === "other" && "*"}
              </Label>
              <Input
                id="heardDetails"
                value={formState.heardDetails}
                onChange={(event) => updateField("heardDetails")(event.target.value)}
                placeholder="Например, рекомендация коллеги, телеграм-канал и т.д."
              />
              <p className="text-xs text-foreground/50">
                Нам важно знать, какие каналы работают лучше всего.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">Чего вы ждёте от платформы?</Label>
              <Textarea
                id="goals"
                rows={5}
                value={formState.goals}
                onChange={(event) => updateField("goals")(event.target.value)}
                placeholder="Опишите задачи, которые хотите автоматизировать"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-[40px] border border-border bg-card/80 p-8 shadow-2xl backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Анкета преподавателя</p>
          <h1 className="mt-2 text-3xl font-light">Добро пожаловать, {teacherEmail}</h1>
          <p className="text-sm text-foreground/60">
            Несколько вопросов помогут адаптировать платформу под ваш университет.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {STEP_TITLES.map((stepItem, index) => (
            <div key={stepItem.title} className="flex items-center gap-3">
              <div
                className={[
                  "flex h-11 w-11 items-center justify-center rounded-full border",
                  index <= step ? "border-foreground bg-foreground text-background" : "border-border text-foreground/50"
                ].join(" ")}
              >
                {index + 1}
              </div>
              {index < STEP_TITLES.length - 1 && <div className="h-px w-10 bg-border" />}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Шаг {step + 1}</p>
          <h2 className="mt-2 text-2xl font-light">{STEP_TITLES[step].title}</h2>
          <p className="text-sm text-foreground/60">{STEP_TITLES[step].description}</p>
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {renderStep()}
          <div className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-foreground/60">
              {step + 1} из {STEP_TITLES.length} — {heardAboutUsLabels[formState.heardAboutUs]}
            </div>
            <div className="flex gap-3">
              {step > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  className="border border-border"
                  onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
                  disabled={saving}
                >
                  Назад
                </Button>
              )}
              <Button type="submit" disabled={saving}>
                {saving ? "Сохраняю..." : isLastStep ? "Завершить" : "Далее"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


