"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ".pdf,.ppt,.pptx,.doc,.docx";

export function UploadForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (newFile: File | null) => {
    setFile(newFile);
    if (newFile && !title) {
      const clearName = newFile.name.replace(/\.[^/.]+$/, "");
      setTitle(clearName);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(event.target.files?.[0] ?? null);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelection(droppedFile);
    }
  };

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
      <div className="space-y-3">
        <Label htmlFor="file-input">Файл</Label>
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragActive(false);
          }}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center rounded-[32px] border border-dashed border-border bg-background-secondary/40 px-6 py-10 text-center transition",
            dragActive && "border-foreground bg-card shadow-card",
            file && "border-foreground/70 bg-card"
          )}
        >
          <p className="text-lg font-light">
            {file ? file.name : "Перетащите файл сюда"}
          </p>
          <p className="mt-2 text-sm text-foreground/60">или нажмите, чтобы выбрать</p>
          <Button type="button" variant="outline" size="sm" className="mt-4">
            Выбрать файл
          </Button>
          <p className="mt-4 text-xs text-foreground/60">
            Поддерживаемые форматы: PDF · PPT · PPTX · DOC · DOCX. До 30 МБ.
          </p>
        </div>
        <input
          id="file-input"
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleFileChange}
          className="sr-only"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Обрабатываем..." : "Загрузить и сгенерировать"}
      </Button>
    </form>
  );
}

