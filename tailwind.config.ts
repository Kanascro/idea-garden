import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mist: "#eef3ff",
        lilac: "#efe6ff",
        peach: "#ffe9e2",
        sage: "#e6f5ec",
        ink: "#263042",
        softline: "rgba(38, 48, 66, 0.08)",
      },
      boxShadow: {
        neu: "12px 12px 28px rgba(159, 174, 201, 0.18), -12px -12px 28px rgba(255,255,255,0.85)",
        neuInset: "inset 7px 7px 14px rgba(159,174,201,0.12), inset -7px -7px 14px rgba(255,255,255,0.9)",
        neuSoft: "8px 8px 20px rgba(159, 174, 201, 0.14), -8px -8px 20px rgba(255,255,255,0.82)"
      },
      backgroundImage: {
        aura: "radial-gradient(circle at top left, rgba(255,255,255,0.85), rgba(255,255,255,0.55) 35%, rgba(238,243,255,0.55) 55%, rgba(239,230,255,0.55) 75%, rgba(230,245,236,0.55) 100%)"
      }
    },
  },
  plugins: [],
};

export default config;