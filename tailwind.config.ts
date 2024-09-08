import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "Noto Color Emoji",
          "sitelen seli kiwen juniko",
          ...defaultTheme.fontFamily.sans,
        ],
        mono: ["monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
