import fs from "fs/promises";
import path from "path";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import { readPptxFile } from "pptx-parser";
import textract from "textract";

const SUPPORTED_TYPES = ["pdf", "ppt", "pptx", "doc", "docx"];

function extractFileType(filePath: string) {
  return path.extname(filePath).replace(".", "").toLowerCase();
}

export async function extractTextFromFile(filePath: string): Promise<string> {
  const type = extractFileType(filePath);

  if (!SUPPORTED_TYPES.includes(type)) {
    throw new Error(`Тип файла ${type} пока не поддерживается`);
  }

  switch (type) {
    case "pdf":
      return extractFromPdf(filePath);
    case "docx":
      return extractFromDocx(filePath);
    case "doc":
      return extractWithTextract(filePath);
    case "ppt":
      return extractWithTextract(filePath);
    case "pptx":
      return extractFromPptx(filePath);
    default:
      throw new Error("Неизвестный тип файла");
  }
}

async function extractFromPdf(filePath: string) {
  const buffer = await fs.readFile(filePath);
  const content = await pdfParse(buffer);
  return content.text.trim();
}

async function extractFromDocx(filePath: string) {
  const buffer = await fs.readFile(filePath);
  const { value } = await mammoth.extractRawText({ buffer });
  return value.trim();
}

async function extractWithTextract(filePath: string) {
  return new Promise<string>((resolve, reject) => {
    textract.fromFileWithPath(filePath, (error, text) => {
      if (error) {
        reject(error);
      } else {
        resolve(text?.trim() ?? "");
      }
    });
  });
}

async function extractFromPptx(filePath: string) {
  if (extractFileType(filePath) === "ppt") {
    return extractWithTextract(filePath);
  }

  const slides = await readPptxFile(filePath);
  const text = slides
    .map((slide) =>
      slide.elements
        ?.map((element) => ("text" in element ? element.text : ""))
        .filter(Boolean)
        .join("\n")
    )
    .filter(Boolean)
    .join("\n\n");

  return text.trim();
}

