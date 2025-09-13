/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--brand-color)',
          fg: 'var(--brand-text-color)'
        }
      },
      fontFamily: {
        staread: ["Nanum Myeongjo"],
        starcil: ["Nanum Myeongjo"],
        serif: ["Nanum Myeongjo"],
        body: ["Inter", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        sans: ["Inter", "system-ui", "Segoe UI", "Arial", "sans-serif"],
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        scroll: "scroll 10s linear infinite",
      },
    },
  },
  plugins: [],
};
