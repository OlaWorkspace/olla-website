import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: "#2563eb",
      secondary: "#1e3a8a",
      background: "#FFFFFF",
      text: "#0f172a",
      "text-light": "#64748b",
      success: "#00A699",
      error: "#EF4444",
      border: "#e2e8f0",
      white: "#FFFFFF",
      black: "#000000",
      transparent: "transparent",
      gray: {
        50: "#f9fafb",
        100: "#f5f5f5",
        200: "#e5e7eb",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
      },
      red: {
        600: "#dc2626",
      },
      blue: {
        100: "#dbeafe",
      },
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    borderRadius: {
      lg: "0.5rem",
      "2xl": "1rem",
    },
    spacing: {
      px: "1px",
      0: "0",
      1: "0.25rem",
      2: "0.5rem",
      3: "0.75rem",
      4: "1rem",
      6: "1.5rem",
      8: "2rem",
      12: "3rem",
      16: "4rem",
      20: "5rem",
      32: "8rem",
    },
  },
  plugins: [],
};

export default config;
