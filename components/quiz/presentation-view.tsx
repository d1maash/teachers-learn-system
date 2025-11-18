"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QuizQuestion = {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
};

type Props = {
  quiz: {
    id: string;
    title: string;
    questions: QuizQuestion[];
  };
};

export function PresentationView({ quiz }: Props) {
  const [index, setIndex] = useState(0);
  const question = quiz.questions[index];

  const next = () => setIndex((prev) => Math.min(prev + 1, quiz.questions.length - 1));
  const prev = () => setIndex((prev) => Math.max(prev - 1, 0));

  if (!question) return null;

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <div className="flex items-center justify-between border-b border-border px-10 py-6">
        <Button asChild variant="ghost" className="text-sm">
          <Link href="/">Главное меню</Link>
        </Button>
        <span className="text-sm uppercase tracking-[0.4em] text-foreground/60">{quiz.title}</span>
        <span className="text-xs text-foreground/50">
          {index + 1}/{quiz.questions.length}
        </span>
      </div>
      <div className="flex-1 px-16 py-12 space-y-12">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-foreground/40">
            Вопрос {index + 1} / {quiz.questions.length}
          </p>
          <h1 className="mt-4 text-5xl font-light leading-tight">{question.text}</h1>
        </div>
        <div className="grid gap-6">
          {question.options.map((option, optionIdx) => (
            <div
              key={option.id}
              className={cn(
                "rounded-3xl border border-border px-10 py-6 text-3xl font-light flex gap-6",
                "hover:bg-foreground hover:text-background transition-colors"
              )}
            >
              <span className="font-medium">{String.fromCharCode(65 + optionIdx)}.</span>
              <span>{option.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border px-16 py-8">
        <Button variant="outline" onClick={prev} disabled={index === 0}>
          Назад
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">Главное меню</Link>
        </Button>
        <Button onClick={next} disabled={index === quiz.questions.length - 1}>
          Далее
        </Button>
      </div>
    </div>
  );
}

