/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        staread: ["Nanum Myeongjo"],
        starcil: ["Nanum Myeongjo"],
        serif: ["Nanum Myeongjo"],
        body: ["Nanum Myeongjo"],
        sans: ["Nanum Myeongjo"],
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
