export type GeneratedQuiz = {
  quizTitle: string;
  questions: {
    text: string;
    options: {
      text: string;
      isCorrect: boolean;
    }[];
  }[];
};

export interface QuizGenerator {
  generateQuizFromText(text: string): Promise<GeneratedQuiz>;
}

