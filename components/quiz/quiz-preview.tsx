"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type QuizQuestion = {
  id: string;
  text: string;
  order: number;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
};

type Props = {
  quiz: {
    id: string;
    title: string;
    questions: QuizQuestion[];
  };
};

export function QuizPreview({ quiz }: Props) {
  const [selected, setSelected] = useState<Record<string, string | undefined>>({});
  const [showResults, setShowResults] = useState(false);

  const answeredCount = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected]
  );

  const score = useMemo(() => {
    if (!showResults) return 0;
    return quiz.questions.reduce((acc, question) => {
      const selectedOption = question.options.find((option) => option.id === selected[question.id]);
      return selectedOption?.isCorrect ? acc + 1 : acc;
    }, 0);
  }, [quiz.questions, selected, showResults]);

  const handleSelect = (questionId: string, optionId: string) => {
    setSelected((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
    if (showResults) {
      setShowResults(false);
    }
  };

  const handleShowResults = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setSelected({});
    setShowResults(false);
  };

  const totalQuestions = quiz.questions.length;

  return (
    <div className="space-y-8">
      <Card className="border border-foreground/10 bg-background text-foreground">
        <CardHeader className="gap-6 sm:flex sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Викторина</p>
            <CardTitle className="mt-2 text-3xl font-light">{quiz.title}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="ghost">
              <Link href="/">Главное меню</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/quizzes/${quiz.id}/present`}>Режим презентации</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Всего вопросов" value={totalQuestions} />
            <Stat label="Отвечено" value={answeredCount} />
            <Stat label="Результат" value={showResults ? `${score}/${totalQuestions}` : "—"} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleShowResults} disabled={answeredCount !== totalQuestions}>
              Показать результаты
            </Button>
            <Button variant="ghost" onClick={handleReset}>
              Сбросить
            </Button>
          </div>
          {answeredCount !== totalQuestions && (
            <p className="text-sm text-foreground/60">
              Ответь на все вопросы, чтобы увидеть правильные ответы.
            </p>
          )}
          {showResults && (
            <p className="text-sm text-foreground">
              Правильных ответов: {score} из {totalQuestions}.
            </p>
          )}
        </CardContent>
      </Card>

      <ol className="space-y-6">
        {quiz.questions.map((question) => (
          <li key={question.id}>
            <Card className="border border-foreground/10 bg-card text-foreground">
              <CardHeader className="flex-row items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 text-sm font-semibold">
                  {question.order}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">Вопрос</p>
                  <CardTitle className="mt-1 text-xl font-medium">{question.text}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-2 sm:grid-cols-2">
              {question.options.map((option, index) => {
                const optionLetter = String.fromCharCode(65 + index);
                const isSelected = selected[question.id] === option.id;
                const isCorrect = option.isCorrect;
                const isRevealedCorrect = showResults && isCorrect;
                const isRevealedWrong = showResults && isSelected && !isCorrect;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(question.id, option.id)}
                    className={cn(
                      "group flex items-start gap-3 rounded-2xl border border-foreground/15 px-4 py-3 text-left text-sm transition",
                      {
                        "border-green-500 bg-green-50 text-foreground": isRevealedCorrect,
                        "border-red-500 bg-red-50 text-foreground": isRevealedWrong,
                        "border-foreground bg-foreground text-background": !showResults && isSelected,
                        "hover:border-foreground/40": !isSelected && !showResults,
                        "opacity-60": showResults && !isSelected && !isCorrect
                      }
                    )}
                    aria-pressed={isSelected}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition",
                        isRevealedCorrect
                          ? "border-green-500 text-green-700"
                          : isRevealedWrong
                            ? "border-red-500 text-red-700"
                            : isSelected
                              ? "border-background bg-background text-foreground"
                              : "border-foreground/30 text-foreground/60"
                      )}
                    >
                      {optionLetter}
                    </span>
                    <span className="text-base leading-relaxed">{option.text}</span>
                  </button>
                );
              })}
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-background px-4 py-3 text-center">
      <p className="text-xs uppercase tracking-[0.4em] text-foreground/50">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

