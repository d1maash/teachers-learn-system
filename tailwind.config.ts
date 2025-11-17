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
        border: "rgba(0,0,0,0.1)",
        background: "#FFFFFF",
        foreground: "#000000"
      },
      fontFamily: {
        sans: ["'Inter'", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        card: "0 10px 30px rgba(0,0,0,0.05)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;

