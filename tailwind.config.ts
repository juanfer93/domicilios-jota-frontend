import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jjBlue: "#174A8B",
        jjBlueDark: "#030303ff",
        jjBeige: "#F5E9C8",
        jjBeigeSoft: "#FFF9E8",
      },
    },
  },
  plugins: [],
};
export default config;
