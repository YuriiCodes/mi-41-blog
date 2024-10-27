import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
