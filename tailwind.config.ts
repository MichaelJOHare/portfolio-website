import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "565px",
      ...defaultTheme.screens,
    },
    extend: {
      screens: {
        "3xl": "1660px",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
export default config;
