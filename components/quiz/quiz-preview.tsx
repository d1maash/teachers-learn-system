import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-foreground/40">Викторина</p>
          <h1 className="text-4xl font-light">{quiz.title}</h1>
        </div>
        <Button asChild>
          <Link href={`/quizzes/${quiz.id}/present`}>Режим презентации</Link>
        </Button>
      </div>
      <ol className="space-y-12">
        {quiz.questions.map((question) => (
          <li key={question.id} className="space-y-4">
            <h3 className="text-2xl font-light">
              {question.order}. {question.text}
            </h3>
            <div className="grid gap-3">
              {question.options.map((option, index) => (
                <div
                  key={option.id}
                  className="rounded-2xl border border-border px-6 py-4 text-lg"
                >
                  <span className="font-medium mr-3">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option.text}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

