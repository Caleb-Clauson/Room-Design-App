import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#05070b',
          panel: '#0e111a',
          panelSoft: '#161b26',
          line: '#272f42',
          text: '#94a3b8',
          textStrong: '#f8fafc',
          accent: '#06b6d4', // Cyan accent for modern CAD feel
        }
      },
      boxShadow: {
        glow: '0 0 20px rgba(6, 182, 212, 0.35)',
      },
      borderRadius: {
        xl2: '1rem',
      }
    },
  },
  plugins: [],
};
export default config;