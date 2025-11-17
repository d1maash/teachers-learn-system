"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const ACCEPTED_TYPES = ".pdf,.ppt,.pptx,.doc,.docx";

export function UploadForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast({ title: "Нужно выбрать файл" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (title) {
      formData.append("title", title);
    }

    setLoading(true);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });
    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      toast({
        title: "Ошибка обработки",
        description: data.error ?? "Попробуйте ещё раз"
      });
      return;
    }

    const data = await response.json();
    toast({ title: "Готово!", description: "Викторина создана" });
    router.push(`/quizzes/${data.quizId}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="title">Название</Label>
        <Input
          id="title"
          placeholder="Например, 'Лекция по истории'"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">Файл</Label>
        <input
          id="file"
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="block w-full text-sm text-foreground file:mr-4 file:rounded-full file:border file:border-border file:bg-background file:px-6 file:py-3 file:text-sm file:font-medium file:text-foreground hover:file:bg-foreground hover:file:text-background"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Обрабатываем..." : "Загрузить и сгенерировать"}
      </Button>
    </form>
  );
}

