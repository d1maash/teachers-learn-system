import { GoogleGenerativeAI } from "@google/generative-ai";
import { QuizGenerator, GeneratedQuiz } from "./types";

const SYSTEM_PROMPT = `
Ты помощник для преподавателей. На основе переданного учебного материала создай минимум 10 вопросов с одним правильным вариантом ответа. Каждый вопрос должен иметь 4 варианта (A-D) и строго один правильный ответ. Ответ дай в формате JSON со схемой:
{
  "quizTitle": "string",
  "questions": [
    {
      "text": "string",
      "options": [
        { "text": "string", "isCorrect": boolean }
      ]
    }
  ]
}
`;

export class GeminiQuizGenerator implements QuizGenerator {
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generateQuizFromText(text: string): Promise<GeneratedQuiz> {
    if (!text || text.trim().length === 0) {
      throw new Error("Пустой текст для генерации викторины");
    }

    const trimmed = text.length > 12000 ? text.slice(0, 12000) : text;

    const model = this.client.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent([
      {
        role: "user",
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\nКонтент:\n${trimmed}`
          }
        ]
      }
    ]);

    const response = await result.response;
    const responseText = response.text().trim();

    if (!responseText) {
      throw new Error("Пустой ответ от Gemini");
    }

    let parsed: GeneratedQuiz;

    try {
      parsed = JSON.parse(responseText);
    } catch (error) {
      throw new Error("Не удалось разобрать JSON от Gemini");
    }

    if (!parsed.questions || parsed.questions.length < 10) {
      throw new Error("Gemini вернул недостаточно вопросов");
    }

    parsed.questions.forEach((question, idx) => {
      if (!question.options || question.options.length !== 4) {
        throw new Error(`У вопроса №${idx + 1} некорректное количество вариантов`);
      }

      const correct = question.options.filter((option) => option.isCorrect);
      if (correct.length !== 1) {
        throw new Error(`У вопроса №${idx + 1} некорректное количество правильных ответов`);
      }
    });

    return parsed;
  }
}

