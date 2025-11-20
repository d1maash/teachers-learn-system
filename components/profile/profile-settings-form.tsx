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
  mapTeacherToFormState,
  serializeProfileForm,
  type TeacherProfileFormState
} from "@/lib/profile/form";

type Props = {
  initialData: TeacherProfileFormState;
  submitLabel?: string;
  successMessage?: string;
};

export function ProfileSettingsForm({
  initialData,
  submitLabel = "Сохранить изменения",
  successMessage = "Профиль обновлён"
}: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [formState, setFormState] = useState<TeacherProfileFormState>(initialData);
  const [saving, setSaving] = useState(false);

  const updateField = <Key extends keyof TeacherProfileFormState>(field: Key) => {
    return (value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    const payload = serializeProfileForm(formState);
    const parsed = teacherProfileSchema.safeParse(payload);

    if (!parsed.success) {
      setSaving(false);
      toast({
        title: "Проверьте поля",
        description: "Заполните обязательные поля и попробуйте снова"
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
        title: "Не удалось сохранить",
        description: "Попробуйте снова или обратитесь к поддержке",
        variant: "destructive"
      });
      return;
    }

    const result = await response.json();

    setFormState(mapTeacherToFormState(result.teacher));
    router.refresh();

    toast({
      title: successMessage
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Шаг 1</p>
          <h3 className="mt-2 text-2xl font-light">Личные данные</h3>
          <p className="text-sm text-foreground/60">Расскажите о себе и ваших контактах.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Полное имя *</Label>
            <Input
              id="name"
              value={formState.name}
              onChange={(event) => updateField("name")(event.target.value)}
              placeholder="Например, Анна Петрова"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subjects">Предметы *</Label>
            <Input
              id="subjects"
              value={formState.subjects}
              onChange={(event) => updateField("subjects")(event.target.value)}
              placeholder="Математический анализ, алгебра"
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
            <p className="text-xs text-foreground/50">Используем только для связи по сервису.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram</Label>
            <Input
              id="telegram"
              value={formState.telegram}
              onChange={(event) => updateField("telegram")(event.target.value)}
              placeholder="@teacher_helper"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Шаг 2</p>
          <h3 className="mt-2 text-2xl font-light">Учебное заведение</h3>
          <p className="text-sm text-foreground/60">Где вы преподаёте и какое подразделение?</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="university">Университет *</Label>
            <Input
              id="university"
              value={formState.university}
              onChange={(event) => updateField("university")(event.target.value)}
              placeholder="МГУ, НИУ ВШЭ и т.д."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Факультет / кафедра</Label>
            <Input
              id="department"
              value={formState.department}
              onChange={(event) => updateField("department")(event.target.value)}
              placeholder="Факультет ВМК"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Город</Label>
            <Input
              id="city"
              value={formState.city}
              onChange={(event) => updateField("city")(event.target.value)}
              placeholder="Москва"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Шаг 3</p>
          <h3 className="mt-2 text-2xl font-light">Как вы узнали о нас?</h3>
          <p className="text-sm text-foreground/60">Эти ответы помогают нам развивать сервис.</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heardAboutUs">Источник *</Label>
            <select
              id="heardAboutUs"
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
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
            <Label htmlFor="heardDetails">Детали</Label>
            <Input
              id="heardDetails"
              value={formState.heardDetails}
              onChange={(event) => updateField("heardDetails")(event.target.value)}
              placeholder="Например, рекомендация коллеги, конференция..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goals">Что вы ожидаете от платформы?</Label>
            <Textarea
              id="goals"
              value={formState.goals}
              onChange={(event) => updateField("goals")(event.target.value)}
              placeholder="Опишите сценарии, которые хотите автоматизировать"
              rows={4}
            />
          </div>
        </div>
      </section>

      <Button type="submit" className="w-full md:w-auto" disabled={saving}>
        {saving ? "Сохраняю..." : submitLabel}
      </Button>
    </form>
  );
}


