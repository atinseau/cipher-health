// tailwind.config.js
import { nextui } from "@nextui-org/react";

// Due to the monorepo structure, we need to get the absolute path of the nextui package
// to make sure Tailwind can find the files to compile
const nextuiPath = require
  .resolve("@nextui-org/theme")
  .replace('/dist/index.js', '')

/**
 * @type {import('tailwindcss').Config}
 */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    nextuiPath + "/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()]
}

export default config;