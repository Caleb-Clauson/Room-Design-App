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
          bg: '#090a0f',
          panel: '#13151c',
          panelSoft: '#1c1f2a',
          line: '#333848',
          text: '#d1d5db',
          textStrong: '#ffffff',
          accent: '#3b82f6',
        }
      },
      boxShadow: {
        glow: '0 0 15px rgba(59, 130, 246, 0.5)',
      },
      borderRadius: {
        xl2: '1rem',
      }
    },
  },
  plugins: [],
};
export default config;