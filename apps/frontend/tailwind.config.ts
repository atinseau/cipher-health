  // tailwind.config.js
import { nextui } from "@nextui-org/react";
import type { Config } from 'tailwindcss'

// Due to the monorepo structure, we need to get the absolute path of the nextui package
// to make sure Tailwind can find the files to compile
const nextuiPath = require
  .resolve("@nextui-org/theme")
  .replace('/dist/index.js', '')

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    nextuiPath + "/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontSize: {
        sm: '12px',
        base: '16px',
        md: '18px',
        lg: '20px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
      },
      lineHeight: {
        base: '120%'
      },
      fontFamily: {
        sofiaProSoft: ['var(--font-sofia-pro-soft)'],
        roboto: ['var(--font-roboto)'],
      },
      screens: {
        '2xl': '1440px'
      },
      borderRadius: {
        sm: '4px'
      },
      colors: {
        black: '#2D2D2D',
        purple: {
          400: '#EACCF6',
          500: "#9700D1",
        },
        indigo: {
          200: "#F6F6FF",
          300: "#EEEAFF",
          400: "#AC9AF8",
          500: "#7556F4",
          600: "#5841B7",
          700: "#3B2B7A"
        },
        gray: {
          300: "#FAFAFA",
          400: "#EAEAEA",
          500: "#B2B2B2",
          600: "#808080",
          700: "#545454"
        },
        danger: {
          DEFAULT: '#EF6262',
          600: '#D24444'
        },
        pink: {
          400: "#F9CCE4",
          500: "#E1007A",
        },
        success: {
          DEFAULT: '#45D4B2',
          600: '#35B395'
        }
      }
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        layout: {
          hoverOpacity: 1,
          disabledOpacity: 1
        }
      }
    }
  })]
}

export default config;