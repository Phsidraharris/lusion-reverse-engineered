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
        // Serif fonts for titles and headings (like Perplexity)
        serif: ["Nanum Myeongjo", "Georgia", "Times New Roman", "serif"],
        title: ["Nanum Myeongjo", "Georgia", "Times New Roman", "serif"],
        
        // Sans-serif fonts for body text and UI (like Perplexity)
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        
        // Monospace for code
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
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
