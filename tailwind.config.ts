import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["var(--font-sans)", "Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-sans)", "Poppins", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        cream: "#fffaf6",
        band: "#fbf3e2",
        gold: {
          DEFAULT: "#ffc200",
          dark: "#edb100",
          light: "#ffe082"
        },
        blue: {
          DEFAULT: "#2196f3",
          dark: "#1976d2",
          light: "#42a9f5"
        },
        ink: {
          DEFAULT: "#141414",
          light: "#2a2a2a",
          muted: "#3c3c3c"
        },
        muted: {
          DEFAULT: "#5b5b5b",
          dark: "#474747",
          foreground: "#71717a"
        },
        line: "#ece7df",
        panel: "#f3f5f8",
        border: "#ece7df",
        background: "#ffffff",
        foreground: "#141414",
        primary: {
          DEFAULT: "#141414",
          foreground: "#ffffff"
        },
        accent: {
          DEFAULT: "#141414",
          foreground: "#ffffff"
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff"
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#141414"
        },
        ring: "#2196f3",
        success: {
          DEFAULT: "#10b981",
          foreground: "#ffffff"
        },
        warning: {
          DEFAULT: "#f59e0b",
          foreground: "#141414"
        }
      },
      borderRadius: {
        "3xl": "24px",
        "2xl": "16px",
        xl: "12px",
        lg: "10px",
        md: "8px",
        sm: "6px"
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(20, 20, 20, 0.05)",
        "card-hover": "0 14px 34px -4px rgba(20, 20, 20, 0.08)",
        "gold-glow": "0 10px 25px -5px rgba(255, 194, 0, 0.4)",
        "blue-glow": "0 10px 25px -5px rgba(33, 150, 243, 0.35)",
        premium: "0 20px 45px -15px rgba(20, 20, 20, 0.08)"
      }
    }
  },
  plugins: [animate]
};

export default config;
