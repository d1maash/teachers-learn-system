import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(80).optional()
});

export const heardAboutUsOptions = [
  "search",
  "colleagues",
  "conference",
  "social",
  "ads",
  "other"
] as const;
export type HeardAboutUsValue = (typeof heardAboutUsOptions)[number];

export const teacherProfileSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z
    .string()
    .min(6)
    .max(20)
    .regex(/^[\d+()\-\s]+$/)
    .optional()
    .nullable(),
  telegram: z
    .string()
    .min(2)
    .max(50)
    .regex(/^@?[a-zA-Z0-9_]{5,}$/)
    .optional()
    .nullable(),
  subjects: z.string().min(3).max(160),
  university: z.string().min(2).max(160),
  department: z.string().min(2).max(160).optional().nullable(),
  city: z.string().min(2).max(120).optional().nullable(),
  heardAboutUs: z.enum(heardAboutUsOptions),
  heardDetails: z.string().min(3).max(240).optional().nullable(),
  goals: z.string().min(10).max(360).optional().nullable()
}).superRefine((values, ctx) => {
  if (values.heardAboutUs === "other" && !values.heardDetails?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["heardDetails"],
      message: "Расскажите, где вы узнали о нас"
    });
  }
});


