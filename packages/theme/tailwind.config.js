/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sky-Inspired Base Colors
        sky: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
        },
        // TRAJECTORY Logo Colors (Golden & Black)
        gold: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#F59E0B",
          500: "#D97706",
          600: "#B45309",
          700: "#92400E",
          800: "#78350F",
          900: "#451A03",
        },
        // Legacy canyon colors for compatibility
        sunset: "#F59E0B",
        "sunset-dark": "#D97706",
        glow: "#FCD34D",
        // Logo-inspired backgrounds
        trajectory: {
          black: "#000000",
          "black-soft": "#0A0A0A",
          "black-card": "#111111",
        },
        // Inspiring Status Colors
        success: "#10B981",
        warn: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(0,0,0,.4)",
        strata: "0 4px 20px -4px rgba(56, 189, 248, 0.15)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      animation: {
        "strata-float": "strata-float 6s ease-in-out infinite",
        "meter-fill": "meter-fill 1.2s cubic-bezier(.22,.61,.36,1) forwards",
        "fade-slide-up":
          "fade-slide-up 0.45s cubic-bezier(.22,.61,.36,1) forwards",
        stagger: "stagger 0.2s ease-out forwards",
      },
      keyframes: {
        "strata-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "meter-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--fill-width)" },
        },
        "fade-slide-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        stagger: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
