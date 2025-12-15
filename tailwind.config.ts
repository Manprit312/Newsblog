import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        primary: {
          yellow: "#FFD700",
          "yellow-dark": "#FFA500",
          "yellow-light": "#FFF8DC",
        },
        secondary: {
          blue: "#0066CC",
          "blue-dark": "#004499",
          "blue-light": "#3399FF",
        },
        newsline: {
          purple: "#4a148c",
          red: "#dc2626",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#333',
            lineHeight: '1.7',
            h1: {
              fontWeight: '800',
              lineHeight: '1.2',
            },
            h2: {
              fontWeight: '700',
              lineHeight: '1.3',
            },
            h3: {
              fontWeight: '600',
              lineHeight: '1.4',
            },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;






