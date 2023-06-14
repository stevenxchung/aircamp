import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in-slow": "fade-in 4s ease-in-out",
        "fade-in-medium": "fade-in 2s ease-in-out",
        "fade-in-fast": "fade-in 1s ease-in-out",
      },
      backgroundImage: {
        jumbotron: "url('https://tinyurl.com/yanavken')",
      },
      transitionDelay: {
        "2000": "3000ms",
      },
      transitionDuration: {
        "3000": "3000ms",
      },
    },
    keyframes: {
      "fade-in": {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
    },
  },
  plugins: [],
} satisfies Config;
