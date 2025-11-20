"use client";

import { useCallback, useEffect, useState } from "react";
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
  const totalQuestions = quiz.questions.length;
  const question = quiz.questions[index];

  const next = useCallback(
    () => setIndex((prev) => Math.min(prev + 1, totalQuestions - 1)),
    [totalQuestions]
  );
  const prev = useCallback(() => setIndex((prev) => Math.max(prev - 1, 0)), []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        next();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  if (!question) return null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#0C101B] via-[#0A0F1A] to-[#05070D] text-card">
      <div className="relative flex items-center justify-center border-b border-white/10 px-10 py-6 text-card">
        <Button
          asChild
          variant="outline"
          className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full border-white/30 bg-transparent text-xs uppercase tracking-[0.3em] text-card hover:bg-white/10"
        >
          <Link href="/">Главное меню</Link>
        </Button>
        <span className="text-sm uppercase tracking-[0.4em] text-card/70">{quiz.title}</span>
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs text-card/70">
          {index + 1}/{totalQuestions}
        </span>
      </div>
      <div className="flex-1 space-y-12 px-8 py-12 md:px-16">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-card/60">
            Вопрос {index + 1} / {totalQuestions}
          </p>
          <h1 className="text-4xl font-light leading-tight text-white md:text-5xl">{question.text}</h1>
          <div className="h-1.5 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white transition-[width]"
              style={{ width: `${((index + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <div className="grid gap-6">
          {question.options.map((option, optionIdx) => (
            <div
              key={option.id}
              className={cn(
                "flex gap-6 rounded-[36px] border border-white/20 bg-white/5 px-10 py-6 text-2xl font-light text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition",
                "hover:border-white/60 hover:bg-white/10"
              )}
            >
              <span className="font-semibold text-card/70">
                {String.fromCharCode(65 + optionIdx)}.
              </span>
              <span>{option.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 px-8 py-8 text-card md:px-16">
        <Button
          variant="outline"
          onClick={prev}
          disabled={index === 0}
          className="border-white/30 text-card hover:bg-white/10"
        >
          Назад
        </Button>
        <Button asChild variant="ghost" className="text-card hover:bg-white/10">
          <Link href="/">Главное меню</Link>
        </Button>
        <Button
          onClick={next}
          disabled={index === totalQuestions - 1}
          className="bg-white text-foreground hover:bg-white/90"
        >
          Далее
        </Button>
      </div>
    </div>
  );
}

