import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export async function ensureUploadDir() {
  await fs.mkdir(uploadDir, { recursive: true });
}

export async function saveUploadedFile(buffer: Buffer, originalName: string) {
  await ensureUploadDir();
  const id = randomUUID();
  const targetName = `${id}-${originalName}`;
  const filePath = path.join(uploadDir, targetName);
  await fs.writeFile(filePath, buffer);
  return filePath;
}

