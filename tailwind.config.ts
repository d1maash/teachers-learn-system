import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "rgba(15,23,42,0.08)",
        "border-strong": "rgba(15,23,42,0.16)",
        background: "#F7F6F2",
        "background-secondary": "#F2F0EA",
        foreground: "#0F172A",
        muted: "#E5E2DB",
        "muted-foreground": "#5F6472",
        card: "#FFFFFF",
        "card-foreground": "#0F172A",
        accent: "#111827",
        "accent-foreground": "#F8FAFC",
        ring: "#111827"
      },
      fontFamily: {
        sans: ["'Inter'", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        card: "0 25px 60px rgba(15,23,42,0.08)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;

