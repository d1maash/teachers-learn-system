import { heardAboutUsOptions, type HeardAboutUsValue } from "@/lib/auth/validators";

export type TeacherProfileFormState = {
  name: string;
  phone: string;
  telegram: string;
  subjects: string;
  university: string;
  department: string;
  city: string;
  heardAboutUs: HeardAboutUsValue;
  heardDetails: string;
  goals: string;
};

export const defaultProfileFormState: TeacherProfileFormState = {
  name: "",
  phone: "",
  telegram: "",
  subjects: "",
  university: "",
  department: "",
  city: "",
  heardAboutUs: "search",
  heardDetails: "",
  goals: ""
};

type TeacherProfileFromDb = {
  name: string | null;
  phone: string | null;
  telegram: string | null;
  subjects: string | null;
  university: string | null;
  department: string | null;
  city: string | null;
  heardAboutUs: string | null;
  heardDetails: string | null;
  goals: string | null;
};

export const mapTeacherToFormState = (teacher?: TeacherProfileFromDb | null): TeacherProfileFormState => {
  if (!teacher) {
    return { ...defaultProfileFormState };
  }

  return {
    name: teacher.name ?? "",
    phone: teacher.phone ?? "",
    telegram: teacher.telegram ?? "",
    subjects: teacher.subjects ?? "",
    university: teacher.university ?? "",
    department: teacher.department ?? "",
    city: teacher.city ?? "",
    heardAboutUs: (teacher.heardAboutUs as HeardAboutUsValue) ?? defaultProfileFormState.heardAboutUs,
    heardDetails: teacher.heardDetails ?? "",
    goals: teacher.goals ?? ""
  };
};

const normalizeField = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : "";
};

const nullableField = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

export type TeacherProfileRequestPayload = {
  name: string;
  phone?: string | null;
  telegram?: string | null;
  subjects: string;
  university: string;
  department?: string | null;
  city?: string | null;
  heardAboutUs: HeardAboutUsValue;
  heardDetails?: string | null;
  goals?: string | null;
};

export const serializeProfileForm = (form: TeacherProfileFormState): TeacherProfileRequestPayload => {
  const telegram = nullableField(form.telegram);
  const normalizedTelegram =
    telegram && telegram.length > 0 ? (telegram.startsWith("@") ? telegram : `@${telegram}`) : null;

  return {
    name: normalizeField(form.name),
    phone: nullableField(form.phone),
    telegram: normalizedTelegram,
    subjects: normalizeField(form.subjects),
    university: normalizeField(form.university),
    department: nullableField(form.department),
    city: nullableField(form.city),
    heardAboutUs: form.heardAboutUs,
    heardDetails: nullableField(form.heardDetails),
    goals: nullableField(form.goals)
  };
};

export const heardAboutUsLabels: Record<HeardAboutUsValue, string> = {
  search: "Поиск в интернете",
  colleagues: "Коллеги / сарафанное радио",
  conference: "Профессиональные конференции",
  social: "Социальные сети",
  ads: "Платная реклама",
  other: "Другое"
};

export const heardAboutUsChoices = heardAboutUsOptions.map((value) => ({
  value,
  label: heardAboutUsLabels[value]
}));




