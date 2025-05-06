// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#131316",
        "primary-hover": "#333333",
      },
    },
  },
  plugins: [],
} satisfies Config;
