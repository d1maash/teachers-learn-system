\"use client\";

import { useMemo, useState } from \"react\";
import Link from \"next/link\";
import { Button } from \"@/components/ui/button\";
import { cn } from \"@/lib/utils\";

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
    <div className=\"space-y-10\">
      <div className=\"rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-8 text-white shadow-2xl\">
        <div className=\"flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between\">
          <div>
            <p className=\"text-sm uppercase tracking-[0.35em] text-white/60\">Викторина</p>
            <h1 className=\"mt-2 text-4xl font-light leading-tight sm:text-5xl\">{quiz.title}</h1>
          </div>
          <Button asChild variant=\"outline\" className=\"border-white/30 text-white hover:bg-white/10\">
            <Link href={`/quizzes/${quiz.id}/present`}>Режим презентации</Link>
          </Button>
        </div>

        <div className=\"mt-8 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-3\">
          <Stat label=\"Всего вопросов\" value={totalQuestions} />
          <Stat label=\"Отвечено\" value={answeredCount} />
          <Stat label=\"Результат\" value={showResults ? `${score}/${totalQuestions}` : \"—\"} />
        </div>

        <div className=\"mt-6 flex flex-wrap gap-3\">
          <Button
            onClick={handleShowResults}
            disabled={answeredCount !== totalQuestions}
            className=\"bg-white text-indigo-900 hover:opacity-90 disabled:bg-white/40 disabled:text-white/70\"
          >
            Показать результаты
          </Button>
          <Button variant=\"ghost\" onClick={handleReset} className=\"text-white hover:bg-white/10\">
            Сбросить
          </Button>
        </div>
        {answeredCount !== totalQuestions && (
          <p className=\"mt-2 text-sm text-white/60\">
            Ответь на все вопросы, чтобы увидеть правильные ответы.
          </p>
        )}
        {showResults && (
          <p className=\"mt-2 text-sm text-emerald-300\">
            Отлично! Ты правильно ответил на {score} из {totalQuestions}.
          </p>
        )}
      </div>

      <ol className=\"space-y-8\">
        {quiz.questions.map((question) => (
          <li key={question.id} className=\"space-y-4 rounded-3xl border border-border/60 bg-card/60 p-6 shadow-lg\">
            <div className=\"flex items-start gap-4\">
              <div className=\"flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 text-base font-semibold text-foreground\">
                {question.order}
              </div>
              <div>
                <p className=\"text-xs uppercase tracking-[0.4em] text-muted-foreground\">Вопрос</p>
                <h3 className=\"mt-1 text-2xl font-semibold text-foreground/90\">{question.text}</h3>
              </div>
            </div>

            <div className=\"mt-4 grid gap-3 sm:grid-cols-2\">
              {question.options.map((option, index) => {
                const optionLetter = String.fromCharCode(65 + index);
                const isSelected = selected[question.id] === option.id;
                const isCorrect = option.isCorrect;
                const isRevealedCorrect = showResults && isCorrect;
                const isRevealedWrong = showResults && isSelected && !isCorrect;

                return (
                  <button
                    key={option.id}
                    type=\"button\"
                    onClick={() => handleSelect(question.id, option.id)}
                    className={cn(
                      \"group flex items-start gap-4 rounded-2xl border px-5 py-4 text-left text-base transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40\",
                      {
                        \"border-emerald-400 bg-emerald-50 text-emerald-900\":
                          isRevealedCorrect,
                        \"border-rose-400 bg-rose-50 text-rose-900\": isRevealedWrong,
                        \"border-foreground bg-foreground text-background shadow-lg\":
                          !showResults && isSelected,
                        \"border-border bg-background/80 hover:border-foreground/60 hover:bg-foreground/5\":
                          !isSelected && !showResults,
                        \"border-border/80 bg-background/60\":
                          showResults && !isSelected && !isCorrect
                      }
                    )}
                    aria-pressed={isSelected}
                  >
                    <span
                      className={cn(
                        \"flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-all\",
                        isRevealedCorrect
                          ? \"border-emerald-500 bg-emerald-500/10 text-emerald-900\"
                          : isRevealedWrong
                            ? \"border-rose-500 bg-rose-500/10 text-rose-900\"
                            : isSelected
                              ? \"border-transparent bg-background text-foreground\"
                              : \"border-border text-foreground/70\"
                      )}
                    >
                      {optionLetter}
                    </span>
                    <span className=\"text-lg leading-relaxed\">{option.text}</span>
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className=\"rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center\">
      <p className=\"text-xs uppercase tracking-[0.4em] text-white/60\">{label}</p>
      <p className=\"mt-1 text-2xl font-semibold text-white\">{value}</p>
    </div>
  );
}

