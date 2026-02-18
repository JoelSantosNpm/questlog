import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Esto nos permite usar la profundidad de campo como valores estándar
      perspective: {
        "1200": "1200px",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".transform-style-3d": {
          "transform-style": "preserve-3d",
        },
        ".perspective-1200": {
          perspective: "1200px",
        },
        ".backface-hidden": {
          "backface-visibility": "hidden",
        },
      });
    }),
  ],
};

export default config;
