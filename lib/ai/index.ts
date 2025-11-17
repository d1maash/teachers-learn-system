import { GeminiQuizGenerator } from "./gemini";
import { QuizGenerator } from "./types";

export function getQuizGenerator(): QuizGenerator {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY не задан");
  }

  return new GeminiQuizGenerator(apiKey);
}

