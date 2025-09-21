/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          background: '#F9F9F9', // Light grey background
          text: '#2A2A2A',       // Soft black text
          accent: '#3A506B',      // Muted blue accent
          'accent-hover': '#2E4057', // Darker blue for hover
        }
      },
      fontFamily: {
        // Unify all fonts to Inter
        sans: ["Inter", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        serif: ["Inter", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        body: ["Inter", "system-ui", "Segoe UI", "Arial", "sans-serif"],
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
